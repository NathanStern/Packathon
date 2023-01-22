import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { DecodedToken } from '../interfaces/DecodedToken';

export const tokenVerifier = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.status(401).send({ status: 401, message: "Invalid auth token" });
        return;
    }
    const auth_token = req.headers.authorization.replace("Bearer ", "");
    jwt.verify(auth_token, process.env.jwtsecret, (err, decoded: DecodedToken) => {
        if (err || decoded.scope !== "user") {
            res.status(401).send({ status: 401, message: "Invalid auth token", err: err.message });
            return;
        }
        next()
    });
};

export const userIdScraper = (token: string): string => {
    const decoded: any = jwt.verify(token.replace("Bearer ", ""), process.env.jwtsecret);
    return decoded.id;
}