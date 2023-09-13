import { Response } from 'express';

interface ResponseData {
    statusCode: number;
    data?: any;
    message?: string | null;
    pagination?: any | null;
}

const response = (
    res: Response,
    status: number,
    message: string,
    result?: any,
    pagination?: any
) => {
    const resultPrint: ResponseData = {
        statusCode: status,
        data: result,
        message: message || null,
        pagination: pagination,
    };
    res.status(status).json(resultPrint);
};

export default response;
