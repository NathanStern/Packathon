import express, { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { db } from '../db';
import * as jwt from 'jsonwebtoken';
import { DecodedToken } from '../interfaces/DecodedToken';

export const get_user_profile = (req: Request, res: Response) => {
    const auth_token = req.headers.authorization.replace("Bearer ", "");

    jwt.verify(auth_token, process.env.jwtsecret, (err, decoded: DecodedToken) => {
        if (err || decoded.scope !== "user") {
            res.status(401).send({status: 401, message: "Invalid auth token", err: err.message});
            return;
        }

        db.query('SELECT username, email FROM users WHERE id=$1', [decoded.id])
            .then((data: QueryResult) => {
                res.send({status: 200, message: "Success", data: data.rows[0]});
            })
            .catch((e: Error) => {
                console.log(e.message);
                res.status(500).send({status: 500, message: `Internal server error: ${e.message}`});
            });
    });

}
