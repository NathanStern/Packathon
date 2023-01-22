import * as jwt from 'jsonwebtoken';

export interface DecodedToken extends jwt.JwtPayload {
    id: string;
    scope: string;
    iat: number;
    exp: number;
    iss: string;
}