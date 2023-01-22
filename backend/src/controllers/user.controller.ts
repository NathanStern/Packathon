import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { db } from '../db';
import { userIdScraper } from '../util/jwtVerifier';

export const get_user_profile = (req: Request, res: Response) => {
    const user_id = userIdScraper(req.headers.authorization);

    db.query('SELECT username, email FROM users WHERE id=$1', [user_id])
        .then((data: QueryResult) => {
            res.send({ status: 200, message: "Success", data: data.rows[0] });
        })
        .catch((e: Error) => {
            console.log(e.message);
            res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
        });
}

interface RegistrationRequest {
    username: string;
    email: string;
    password: string;
};

export const create_user = (req: Request, res: Response) => {
    const registration_info: RegistrationRequest = req.body;

    if (!registration_info.username || !registration_info.email || !registration_info.password) {
        res.status(400).send({ status: 400, message: "Invalid request" });
        return;
    }

    db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [registration_info.username, registration_info.email, registration_info.password])
        .then((data: QueryResult) => {
            res.send({ status: 200, message: "Success" });
        })
        .catch((e: Error) => {
            console.log(e.message);
            res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
        });
};
