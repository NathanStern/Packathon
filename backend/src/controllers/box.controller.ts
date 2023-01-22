import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { db } from '../db';
import { userIdScraper } from '../util/jwtVerifier';
import { PoolClient } from 'pg';

interface BoxInfo {
    name: string;
    room_id: string;
};

export const create_box = async (req: Request, res: Response) => {
    const user_id = userIdScraper(req.headers.authorization);
    const box_info: BoxInfo = req.body;

    if (!box_info.name || !box_info.room_id) {
        res.status(400).send({ status: 400, message: "Invalid box info" });
        return;
    }

    // get a connection from the connection pool
    let db_client: PoolClient = await db.connect();

    // start the transaction
    db_client.query('BEGIN');

    try {
        // create a query to get the project info from the database using the room id
        let query = `
            SELECT
                p.id
            FROM
                projects p,
                rooms r
            WHERE
                r.id=$1
                AND r.project_id=p.id
                AND p.user_id=$2
            
            UNION

            SELECT
                p.id
            FROM
                projects p,
                rooms r,
                allowlist a
            WHERE
                r.id=$1
                AND r.project_id=p.id
                AND a.project_id=p.id
                AND a.user_id=$2
        `;

        let values = [req.body.room_id, user_id];

        // execute the query
        let result: QueryResult = await db_client.query(query, values);

        if (result.rowCount === 0) {
            res.status(400).send({ status: 400, message: "Invalid room id" });
            db_client.query('ROLLBACK');
        } else {
            // create a query to insert the box into the database
            query = 'INSERT INTO boxes (name, room_id) VALUES ($1, $2)';
            values = [req.body.name, req.body.room_id];
            db_client.query(query, values);
            db_client.query('COMMIT');
            res.send({ status: 200, message: "Success" });
        }
    } catch (e: any) {
        console.log(e.message);
        res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
        db_client.query('ROLLBACK');
    } finally {
        db_client.release();
    }
};

export const delete_box = async (req: Request, res: Response) => {
    const user_id = userIdScraper(req.headers.authorization);
    const box_id = req.params.id;

    if (!box_id) {
        res.status(400).send({ status: 400, message: "box_id must be set as part of url parameters" });
        return;
    }

    // get a connection from the connection pool
    let db_client: PoolClient = await db.connect();

    // start the transaction
    db_client.query('BEGIN');

    try {
        // create a query to get the project info from the database using the room id
        let query = `
            SELECT
                p.id
            FROM
                projects p,
                rooms r,
                boxes b
            WHERE
                b.id=$1
                AND b.room_id=r.id
                AND r.project_id=p.id
                AND p.user_id=$2
            
            UNION

            SELECT
                p.id
            FROM
                projects p,
                rooms r,
                boxes b,
                allowlist a
            WHERE
                b.id=$1
                AND b.room_id=r.id
                AND r.project_id=p.id
                AND a.project_id=p.id
                AND a.user_id=$2
        `;

        let values = [box_id, user_id];

        // execute the query
        let result: QueryResult = await db_client.query(query, values);

        if (result.rowCount === 0) {
            res.status(400).send({ status: 400, message: "Invalid box id" });
            db_client.query('ROLLBACK');
        } else {
            // create a query to delete the box from the database
            query = 'DELETE FROM boxes WHERE id=$1';
            values = [box_id];
            db_client.query(query, values);
            db_client.query('COMMIT');
            res.send({ status: 200, message: "Success" });
        }
    } catch (e: any) {
        console.log(e.message);
        res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
        db_client.query('ROLLBACK');
    } finally {
        db_client.release();
    }
};

export const update_box = async (req: Request, res: Response) => {
    const user_id = userIdScraper(req.headers.authorization);
    const box_id = req.params.id;
    const box_info: BoxInfo = req.body;

    if (!box_id) {
        res.status(400).send({ status: 400, message: "box_id must be set as part of url parameters" });
        return;
    }

    if (!box_info.name || !box_info.room_id) {
        res.status(400).send({ status: 400, message: "Invalid box info" });
        return;
    }

    // get a connection from the connection pool
    let db_client: PoolClient = await db.connect();

    // start the transaction
    db_client.query('BEGIN');

    try {
        // create a query to get the project info from the database using the room id
        let query = `
            SELECT
                p.id
            FROM
                projects p,
                rooms r,
                boxes b
            WHERE
                b.id=$1
                AND b.room_id=r.id
                AND r.project_id=p.id
                AND p.user_id=$2
            
            UNION

            SELECT
                p.id
            FROM
                projects p,
                rooms r,
                boxes b,
                allowlist a
            WHERE
                b.id=$1
                AND b.room_id=r.id
                AND r.project_id=p.id
                AND a.project_id=p.id
                AND a.user_id=$2
        `;

        let values = [box_id, user_id];

        // execute the query
        let result: QueryResult = await db_client.query(query, values);

        if (result.rowCount === 0) {
            res.status(400).send({ status: 400, message: "Invalid box id" });
            db_client.query('ROLLBACK');
        } else {
            // create a query to update the box in the database
            query = 'UPDATE boxes SET name=$1, room_id=$2 WHERE id=$3';
            values = [box_info.name, box_info.room_id, box_id];
            db_client.query(query, values);
            db_client.query('COMMIT');
            res.send({ status: 200, message: "Success" });
        }
    } catch (e: any) {
        console.log(e.message);
        res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
        db_client.query('ROLLBACK');
    } finally {
        db_client.release();
    }
};

export const get_box = async (req: Request, res: Response) => {
    const user_id = userIdScraper(req.headers.authorization);
    const box_id = req.params.id;

    if (!box_id) {
        res.status(400).send({ status: 400, message: "box_id must be set as part of url parameters" });
        return;
    }

    // get a connection from the connection pool
    let db_client: PoolClient = await db.connect();

    // start the transaction
    db_client.query('BEGIN');

    try {
        // create a query to get the project info from the database using the room id
        let query = `
            SELECT
                p.id
            FROM
                projects p,
                rooms r,
                boxes b
            WHERE
                b.id=$1
                AND b.room_id=r.id
                AND r.project_id=p.id
                AND p.user_id=$2
            
            UNION

            SELECT
                p.id
            FROM
                projects p,
                rooms r,
                boxes b,
                allowlist a
            WHERE
                b.id=$1
                AND b.room_id=r.id
                AND r.project_id=p.id
                AND a.project_id=p.id
                AND a.user_id=$2
        `;

        let values = [box_id, user_id];

        // execute the query
        let result: QueryResult = await db_client.query(query, values);

        if (result.rowCount === 0) {
            res.status(400).send({ status: 400, message: "Invalid box id" });
            db_client.query('ROLLBACK');
        } else {
            // create a query to get the box from the database
            query = 'SELECT * FROM boxes WHERE id=$1';
            values = [box_id];
            result = await db_client.query(query, values);
            db_client.query('COMMIT');
            res.send({ status: 200, message: "Success", data: result.rows[0] });
        }
    } catch (e: any) {
        console.log(e.message);
        res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
        db_client.query('ROLLBACK');
    } finally {
        db_client.release();
    }
};

export const get_all_boxes_in_room = async (req: Request, res: Response) => {
    const user_id = userIdScraper(req.headers.authorization);
    const room_id = req.query.room_id;

    if (!room_id) {
        res.status(400).send({ status: 400, message: "room_id must be set as part of query parameters" });
        return;
    }

    // get a connection from the connection pool
    let db_client: PoolClient = await db.connect();

    // start the transaction
    db_client.query('BEGIN');

    try {
        // create a query to get the project info from the database using the room id
        let query = `
            SELECT
                p.id
            FROM
                projects p,
                rooms r
            WHERE
                r.id=$1
                AND r.project_id=p.id
                AND p.user_id=$2
            
            UNION

            SELECT
                p.id
            FROM
                projects p,
                rooms r,
                allowlist a
            WHERE
                r.id=$1
                AND r.project_id=p.id
                AND a.project_id=p.id
                AND a.user_id=$2
        `;

        let values = [room_id, user_id];

        // execute the query
        let result: QueryResult = await db_client.query(query, values);

        if (result.rowCount === 0) {
            res.status(400).send({ status: 400, message: "Invalid room id" });
            db_client.query('ROLLBACK');
        } else {
            // create a query to get the box from the database
            query = 'SELECT * FROM boxes WHERE room_id=$1';
            values = [room_id];
            result = await db_client.query(query, values);
            db_client.query('COMMIT');
            res.send({ status: 200, message: "Success", data: result.rows });
        }
    } catch (e: any) {
        console.log(e.message);
        res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
        db_client.query('ROLLBACK');
    } finally {
        db_client.release();
    }
};