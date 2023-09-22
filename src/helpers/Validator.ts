import { z } from 'zod';

const emailSchema = z.string().email();
export const validateEmail = (email: string): boolean => {
    try {
        emailSchema.parse(email);
        return true;
    } catch (error) {
        return false;
    }
}

const passwordSchema = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@#$%^&+=!)',
    });
const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    try {
        passwordSchema.parse(password);
    } catch (error) {
        if (error instanceof z.ZodError) {
            errors.push(...error.errors.map((err) => err.message));
        }
    }
    return errors;
}
export const checkPassword = (password: string): any => {
    const errors = validatePassword(password);
    if (errors.length === 0) {
        return true
    } else {
        let errorValidator: String;
        errorValidator = 'Password is invalid. Errors: '
        errors.forEach((error) => {
            console.error(`- ${error}`);
            errorValidator += `- ${error}`
        });
        console.log(errorValidator)
        return errorValidator
    }
}

const intgerSchema = z
    .number()
export const validateInteger = (count: number): boolean => {
    try {
        if(count === 0) throw Error()
        intgerSchema.parse(count);
        return true;
    } catch (error) {
        return false;
    }
}

const listFacilitiesSchema = z.array(
    z.number(),
)

export const checkListFacilities = (listData: Array<number>): boolean => {
    try {
        listFacilitiesSchema.parse(listData);
        return true;
    } catch (error) {
        return false;
    }
}