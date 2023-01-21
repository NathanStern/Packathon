export interface DecodedToken {
    id: string;
    scope: string;
    iat: number;
    exp: number;
    iss: string;
}