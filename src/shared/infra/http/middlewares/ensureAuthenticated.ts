import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import auth from "../../../../config/auth";
import { AppError } from "../../../errors/AppError";

interface IPayload {
    sub: string;
}

export async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token missing", 401);
    }

    const [, token] = authHeader.split(" ");

    // Na posição 0 vai vir "Bearer", na posição 1 vai vir a string do token, por isso o primeiro valor da desestruturação do array é ignorada e só tem a vírgula e o 2ª valor

    try {
        const { sub: user_id } = verify(token, auth.secret_token) as IPayload;

        request.user = {
            id: user_id,
        };

        next();
    } catch {
        throw new AppError("Invalid token", 401);
    }
}
