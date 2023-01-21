import express, { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { db } from '../db';
import * as jwt from 'jsonwebtoken';
import { DecodedToken } from '../interfaces/DecodedToken';

interface LoginInfo {
    username?: string;
    email?: string;
    password: string;
};

export const authorize = async (req: Request, res: Response) => {
    const login_request: LoginInfo = req.body;
    const response_type = req.query.response_type;

    if (!response_type) {
        res.status(400).send({status: 400, message: "Invalid request: must have response_type query parameter"});
        return;
    }

    if (response_type !== 'token') {
        res.status(400).send({status: 400, message: `Invalid request: response_type '${response_type}' is not supported`});
        return;
    }

    if (!login_request.password || (!login_request.email && !login_request.username)) {
        res.status(400).send({status: 400, message: "Invalid request"});
        return;
    }

    let query: string;
    let params: string[];

    if (login_request.email) {
        query = 'SELECT id FROM users WHERE email=$1 AND password=$2';
        params = [login_request.email, login_request.password];
    } else {
        query = 'SELECT id FROM users WHERE username=$1 AND password=$2';
        params = [login_request.username, login_request.password];
    }

    db.query(query, params)
        .then((data: QueryResult) => {
            if (data.rowCount === 0) {
                res.status(401).send({status: 401, message: "Incorrect username or password"});
                return;
            }
            // generate jwt auth token
            const auth_token = jwt.sign({...(data.rows[0]), scope: "user"}, process.env.jwtsecret, {expiresIn: '30 minutes', issuer: 'packathon'});
            
            // generate refresh token
            const refresh_token = jwt.sign({...(data.rows[0]), scope: "refresh"}, process.env.jwtsecret, {expiresIn: '1 day', issuer: 'packathon'});
            res.send({status: 200, message: "Success", token: auth_token, refresh_token: refresh_token});
        })
        .catch((e: Error) => {
            console.log(e.message);
            res.status(500).send({status: 500, message: `Internal server error: ${e.message}`});
        });
};

export const token = (req: Request, res: Response) => {
    const refresh_token = req.headers.authorization.replace("Bearer ", "");

    jwt.verify(refresh_token, process.env.jwtsecret, (err, decoded: DecodedToken) => {
        if (err) {
            res.status(401).send({status: 401, message: "Invalid refresh token", err: err.message});
            return;
        } else {
            if (decoded.scope !== "refresh") {
                res.status(401).send({status: 401, message: "Invalid refresh token"});
                return;
            }
            const auth_token = jwt.sign({id: decoded.id, scope: "user"}, process.env.jwtsecret, {expiresIn: '30 minutes', issuer: 'packathon'});
            const refresh_token = jwt.sign({id: decoded.id, scope: "refresh"}, process.env.jwtsecret, {expiresIn: '1 day', issuer: 'packathon'});
            res.send({status: 200, message: "Success", token: auth_token, refresh_token: refresh_token});
        }
    });
};