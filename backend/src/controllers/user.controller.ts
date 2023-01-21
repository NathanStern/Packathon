import express, { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { db } from '../db';

interface LoginInfo {
    username?: string;
    email?: string;
    password: string;
};

export const login = async (req: Request, res: Response) => {
    const login_request: LoginInfo = req.body;

    if (!login_request.password || (!login_request.email && !login_request.username)) {
        res.status(400).send({status: 400, message: "Invalid request"});
        return;
    }

    let query: string;
    let params: string[];

    if (login_request.email) {
        query = 'SELECT username, email FROM users WHERE email=$1 AND password=$2';
        params = [login_request.email, login_request.password];
    } else {
        query = 'SELECT username, email FROM users WHERE username=$1 AND password=$2';
        params = [login_request.username, login_request.password];
    }

    db.query(query, params)
        .then((data: QueryResult) => {
            if (data.rowCount === 0) {
                res.status(401).send({status: 401, message: "Incorrect username or password"});
                return;
            }
            res.send({status: 200, message: "Success", data: data.rows});
        })
        .catch((e: Error) => {
            console.log(e.message);
            res.status(500).send({status: 500, message: `Internal server error: ${e.message}`});
        });
};