import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import argon2 from "argon2"
import response from '../helpers/Common'
import Token from "../helpers/Token";
import { validateEmail, checkPassword } from "../helpers/Validator";
const prisma = new PrismaClient()

interface UserData {
    uniqId: string;
    email: string;
    password: string;
    name?: string
}

interface LoginResult {
    uniqId: string;
    email: string;
    name?: string | null;
    phone?: string | null;
    fullname?: string | null;
    isActive: boolean;
}

interface LoginResultToken extends LoginResult {
    access_token: string;
}


export async function register(req: Request, res: Response, next: NextFunction) {
    const { email, password, name } = req.body;

    try {
        switch (true) {
            case !email:
                return response(res, 400, 'Email is required.');
            case !validateEmail(email):
                return response(res, 400, 'Invalid email format.');
            case !password:
                return response(res, 400, 'Password is required.');
            default:
                const passwordValidationResult = checkPassword(password);
                if (passwordValidationResult !== true) {
                    return response(res, 400, `Invalid password: ${passwordValidationResult}`);
                }
        }

        if (!name) {
            return response(res, 400, 'Name is required.');
        }

        const hashedPassword = await argon2.hash(password);
        const userData: UserData = {
            uniqId: uuidv4(),
            email,
            password: hashedPassword,
            name,
        };

        const result = await prisma.user.create({ data: userData });
        return response(res, 200, 'Registration success', { data: result });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return response(res, 400, 'User already registered');
        }
        console.error('Error:', error);
        return response(res, 500, 'Failed to register user');
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
        if (!email || !password || !validateEmail(email) || checkPassword(password) !== true) {
            return response(res, 400, 'Invalid input');
        }

        const searchUser = await prisma.user.findMany({
            where: { email },
        });

        if (searchUser.length === 0) {
            return response(res, 404, 'Email not found');
        }

        const user = searchUser[0];

        if (!user.isActive) {
            return response(res, 401, 'Email not active, please activate');
        }

        const verify = await argon2.verify(user.password, password);

        if (!verify) {
            return response(res, 401, 'Wrong password');
        }

        const { name, phone, fullname, isActive } = user;
        const resultLogin: LoginResult = {
            uniqId: user.uniqId,
            email: user.email,
            name: name || undefined,
            phone: phone || undefined,
            fullname: fullname || undefined,
            isActive,
        };

        const access_token = Token.generateToken(resultLogin);
        const result: LoginResultToken = { ...resultLogin, access_token };

        return response(res, 200, 'Login success', result);
    } catch (error) {
        console.error('Error:', error);
        return response(res, 500, 'Failed to login');
    }
}



export async function activateAccount(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    try {
        if (!validateEmail(email)) {
            return response(res, 400, 'Invalid email');
        }

        const searchUser = await prisma.user.findMany({
            where: { email },
        });

        if (searchUser.length === 0) {
            return response(res, 404, 'Email not found');
        }

        const updateUser = await prisma.user.update({
            where: { email },
            data: { isActive: true },
        });

        if (!updateUser) {
            return response(res, 500, 'Failed to activate email');
        }

        return response(res, 200, 'Email user activated successfully');
    } catch (error) {
        console.error('Error:', error);
        return response(res, 500, 'Failed to activate email');
    }
}