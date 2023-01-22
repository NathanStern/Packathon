import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { db } from '../db';
import { userIdScraper } from '../util/jwtVerifier';
import { PoolClient } from 'pg';

interface RoomInfo {
    name: string;
    project_id: string;
};

export const create_room = async (req: Request, res: Response) => {
    const room_info: RoomInfo = req.body;
    const user_id = userIdScraper(req.headers.authorization);

    if (!room_info.name || !room_info.project_id) {
        res.status(400).send({ status: 400, message: "Invalid room info" });
        return;
    }

    // get a connection from the connection pool
    let db_client: PoolClient = await db.connect();

    // start the transaction
    db_client.query('BEGIN');

    try {
        // create a query to get the project info from the database
        let query = 'SELECT name FROM projects WHERE id=$1 AND user_id=$2 union SELECT p.name FROM projects p, allowlist a WHERE p.id=$1 AND a.project_id=p.id AND a.user_id=$2';
        let values = [room_info.project_id, user_id];

        // execute the query
        let result: QueryResult = await db_client.query(query, values);
        if (result.rowCount === 0) {
            res.status(400).send({ status: 400, message: "Invalid project id" });
            db_client.query('ROLLBACK');
        } else {
            // create a query to insert the room into the database
            query = 'INSERT INTO rooms (name, project_id) VALUES ($1, $2)';
            values = [room_info.name, room_info.project_id];
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
}

export const get_rooms_for_project = async (req: Request, res: Response) => {
    const project_id = req.query.project_id;
    const user_id = userIdScraper(req.headers.authorization);

    if (!project_id) {
        res.status(400).send({ status: 400, message: "project_id must be set as part of query parameters" });
        return;
    }

    // get a connection from the connection pool
    let db_client: PoolClient = await db.connect();

    // start the transaction
    db_client.query('BEGIN');

    try {
        // create a query to get the project info from the database
        let query = 'SELECT name FROM projects WHERE id=$1 AND user_id=$2 union SELECT p.name FROM projects p, allowlist a WHERE p.id=$1 AND a.project_id=p.id AND a.user_id=$2';
        let values = [project_id, user_id];

        // execute the query
        let result: QueryResult = await db_client.query(query, values);
        if (result.rowCount === 0) {
            res.status(400).send({ status: 400, message: "Invalid project id" });
            db_client.query('ROLLBACK');
        } else {
            // create a query to get the rooms from the database
            query = 'SELECT id, name FROM rooms WHERE project_id=$1';
            values = [project_id];

            // execute the query
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
}

export const delete_room = async (req: Request, res: Response) => {
    const room_id = req.params.id;
    const user_id = userIdScraper(req.headers.authorization);

    if (!room_id) {
        res.status(400).send({ status: 400, message: "Invalid room id" });
        return;
    }

    // get a connection from the connection pool
    let db_client: PoolClient = await db.connect();

    // start the transaction
    db_client.query('BEGIN');

    try {
        // create a query to get the room info from the database
        let query = 'SELECT name FROM rooms WHERE id=$1 AND project_id IN (SELECT id FROM projects WHERE user_id=$2) union SELECT r.name FROM rooms r, projects p, allowlist a WHERE r.id=$1 AND r.project_id=p.id AND p.id=a.project_id AND a.user_id=$2';
        let values = [room_id, user_id];

        // execute the query
        let result: QueryResult = await db_client.query(query, values);

        if (result.rowCount === 0) {
            res.status(400).send({ status: 400, message: "Invalid room id" });
            db_client.query('ROLLBACK');
        } else {
            // create a query to delete the room from the database
            query = 'DELETE FROM rooms WHERE id=$1';
            values = [room_id];
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
}

export const update_room = async (req: Request, res: Response) => {
    const room_id = req.params.id;
    const room_info: RoomInfo = req.body;
    const user_id = userIdScraper(req.headers.authorization);

    if (!room_id || !room_info.name) {
        res.status(400).send({ status: 400, message: "Invalid room info" });
        return;
    }

    // get a connection from the connection pool
    let db_client: PoolClient = await db.connect();

    // start the transaction
    db_client.query('BEGIN');

    try {
        // create a query to get the room info from the database
        let query = 'SELECT name FROM rooms WHERE id=$1 AND project_id IN (SELECT id FROM projects WHERE user_id=$2) union SELECT r.name FROM rooms r, projects p, allowlist a WHERE r.id=$1 AND r.project_id=p.id AND p.id=a.project_id AND a.user_id=$2';
        let values = [room_id, user_id];

        // execute the query
        let result: QueryResult = await db_client.query(query, values);

        if (result.rowCount === 0) {
            res.status(400).send({ status: 400, message: "Invalid room id" });
            db_client.query('ROLLBACK');
        } else {
            // create a query to update the room in the database
            query = 'UPDATE rooms SET name=$1 WHERE id=$2';
            values = [room_info.name, room_id];
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

export const get_room = async (req: Request, res: Response) => {
    const room_id = req.params.id;
    const user_id = userIdScraper(req.headers.authorization);

    if (!room_id) {
        res.status(400).send({ status: 400, message: "Invalid room id" });
        return;
    }

    // get a connection from the connection pool
    let db_client: PoolClient = await db.connect();

    // start the transaction
    db_client.query('BEGIN');

    try {
        // create a query to get the room info from the database
        let query = 'SELECT name FROM rooms WHERE id=$1 AND project_id IN (SELECT id FROM projects WHERE user_id=$2) union SELECT r.name FROM rooms r, projects p, allowlist a WHERE r.id=$1 AND r.project_id=p.id AND p.id=a.project_id AND a.user_id=$2';
        let values = [room_id, user_id];

        // execute the query
        let result: QueryResult = await db_client.query(query, values);

        if (result.rowCount === 0) {
            res.status(400).send({ status: 400, message: "Invalid room id" });
            db_client.query('ROLLBACK');
        } else {
            // create a query to get the room from the database
            query = 'SELECT id, name FROM rooms WHERE id=$1';
            values = [room_id];

            // execute the query
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