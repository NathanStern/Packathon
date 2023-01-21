import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

export const db = new Pool({
    user: process.env.sqlusername,
    host: process.env.sqlhost,
    database: process.env.sqldatabase,
    password: process.env.sqlpassword,
    port: Number(process.env.sqlport),
    ssl: true,
    max: 15
});