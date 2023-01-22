import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { db } from '../db';
import { userIdScraper } from '../util/jwtVerifier';
import { PoolClient } from 'pg';

interface ItemInfo {
    id?: string;
    name: string;
    qty: number;
    photo_url?: string;
    box_id: string;
};

export const create_item = async (req: Request, res: Response) => {
    const user_id = userIdScraper(req.headers.authorization);
    const item_info: ItemInfo = req.body;

    const db_client: PoolClient = await db.connect();

    await db_client.query('BEGIN');

    try {
        let query = `
            SELECT
                p.id
            FROM
                projects p,
                boxes b,
                rooms r
            WHERE
                b.id=$1
                AND r.project_id=p.id
                AND p.user_id=$2
                AND b.room_id=r.id

            UNION

            SELECT
                p.id
            FROM
                projects p,
                boxes b,
                rooms r,
                allowlist a
            WHERE
                b.id=$1
                AND r.project_id=p.id
                AND b.room_id=r.id
                AND a.project_id=p.id
                AND a.user_id=$2;
        `;

        let values = [item_info.box_id, user_id];

        let result: QueryResult = await db_client.query(query, values);

        if (result.rowCount === 0) {
            res.status(400).send({status: 400, message: "Invalid box id"});
            db_client.query('ROLLBACK');
        } else {
            // TODO: add photo_url
            let query = `INSERT INTO items (name, qty, box_id) VALUES ($1, $2, $3) RETURNING id;`;
            let values = [item_info.name, item_info.qty, item_info.box_id];

            let result: QueryResult = await db_client.query(query, values);

            await db_client.query('COMMIT');

            res.status(200).send({status: 200, message: "Item created", item_id: result.rows[0].id});

        }
    } catch (err) {
        console.log(err);
        await db_client.query('ROLLBACK');
        res.status(500).send({status: 500, message: "Error creating item"});
    } finally {
        db_client.release();
    }
};

export const delete_item = async (req: Request, res: Response) => {
    const user_id = userIdScraper(req.headers.authorization);
    const item_id = req.params.id;

    const db_client: PoolClient = await db.connect();

    await db_client.query('BEGIN');

    try {
        let query = `
            SELECT
                p.id
            FROM
                projects p,
                boxes b,
                rooms r,
                items i
            WHERE
                i.id=$1
                AND b.id=i.box_id
                AND r.project_id=p.id
                AND p.user_id=$2
                AND b.room_id=r.id

            UNION

            SELECT
                p.id
            FROM
                projects p,
                boxes b,
                rooms r,
                items i,
                allowlist a
            WHERE
                i.id=$1
                AND b.id=i.box_id
                AND r.project_id=p.id
                AND b.room_id=r.id
                AND a.project_id=p.id
                AND a.user_id=$2;
        `;

        let values = [item_id, user_id];

        let result: QueryResult = await db_client.query(query, values);

        if (result.rowCount === 0) {
            res.status(400).send({status: 400, message: "Invalid item id"});
            db_client.query('ROLLBACK');
        } else {
            let query = `DELETE FROM items WHERE id=$1;`;
            let values = [item_id];

            await db_client.query(query, values);

            await db_client.query('COMMIT');

            res.status(200).send({status: 200, message: "Item deleted"});

        }
    } catch (err) {
        await db_client.query('ROLLBACK');
        res.status(500).send({status: 500, message: "Error deleting item"});
    } finally {
        db_client.release();
    }
};

export const update_item = async (req: Request, res: Response) => {
    const user_id = userIdScraper(req.headers.authorization);
    const item_id = req.params.id;
    const item_info: ItemInfo = req.body;

    const db_client: PoolClient = await db.connect();

    await db_client.query('BEGIN');

    try {
        let query = `
            SELECT
                p.id
            FROM
                projects p,
                boxes b,
                rooms r,
                items i
            WHERE
                i.id=$1
                AND b.id=i.box_id
                AND r.project_id=p.id
                AND p.user_id=$2
                AND b.room_id=r.id

            UNION

            SELECT
                p.id
            FROM
                projects p,
                boxes b,
                rooms r,
                items i,
                allowlist a
            WHERE
                i.id=$1
                AND b.id=i.box_id
                AND r.project_id=p.id
                AND b.room_id=r.id
                AND a.project_id=p.id
                AND a.user_id=$2;
        `;

        let values = [item_id, user_id];

        let result: QueryResult = await db_client.query(query, values);

        if (result.rowCount === 0) {
            res.status(400).send({status: 400, message: "Invalid item id"});
            db_client.query('ROLLBACK');
        } else {
            // TODO: add photo_url
            let query = `UPDATE items SET name=$1, qty=$2, box_id=$3 WHERE id=$4;`;
            let values = [item_info.name, item_info.qty, item_info.box_id, item_id];

            await db_client.query(query, values);

            await db_client.query('COMMIT');

            res.status(200).send({status: 200, message: "Item updated"});
        }
    } catch (err) {
        await db_client.query('ROLLBACK');
        res.status(500).send({status: 500, message: "Error updating item"});
    } finally {
        db_client.release();
    }
};

export const get_item = async (req: Request, res: Response) => {
    const user_id = userIdScraper(req.headers.authorization);
    const item_id = req.params.id;

    const db_client: PoolClient = await db.connect();

    await db_client.query('BEGIN');

    try {
        let query = `
            SELECT
                p.id
            FROM
                projects p,
                boxes b,
                rooms r,
                items i
            WHERE
                i.id=$1
                AND b.id=i.box_id
                AND r.project_id=p.id
                AND p.user_id=$2
                AND b.room_id=r.id

            UNION

            SELECT
                p.id
            FROM
                projects p,
                boxes b,
                rooms r,
                items i,
                allowlist a
            WHERE
                i.id=$1
                AND b.id=i.box_id
                AND r.project_id=p.id
                AND b.room_id=r.id
                AND a.project_id=p.id
                AND a.user_id=$2;
        `;

        let values = [item_id, user_id];

        let result: QueryResult = await db_client.query(query, values);

        if (result.rowCount === 0) {
            res.status(400).send({status: 400, message: "Invalid item id"});
            db_client.query('ROLLBACK');
        } else {
            let query = `SELECT * FROM items WHERE id=$1;`;
            let values = [item_id];

            let result: QueryResult = await db_client.query(query, values);

            await db_client.query('COMMIT');

        res.status(200).send({status: 200, message: "Item retrieved", item: result.rows[0]});
        }
    } catch (err) {
        await db_client.query('ROLLBACK');
        res.status(500).send({status: 500, message: "Error retrieving item"});
    } finally {
        db_client.release();
    }
};

export const get_items_in_box = async (req: Request, res: Response) => {
    const user_id = userIdScraper(req.headers.authorization);
    const box_id = req.query.box_id;

    if (!box_id) {
        res.status(400).send({status: 400, message: "box_id must be specified in query parameters"});
        return;
    }

    const db_client: PoolClient = await db.connect();

    await db_client.query('BEGIN');

    try {
        let query = `
            SELECT
                p.id
            FROM
                projects p,
                boxes b,
                rooms r
            WHERE
                b.id=$1
                AND r.project_id=p.id
                AND p.user_id=$2
                AND b.room_id=r.id

            UNION

            SELECT
                p.id
            FROM
                projects p,
                boxes b,
                rooms r,
                allowlist a
            WHERE
                b.id=$1
                AND r.project_id=p.id
                AND b.room_id=r.id
                AND a.project_id=p.id
                AND a.user_id=$2;
        `;

        let values = [box_id, user_id];

        let result: QueryResult = await db_client.query(query, values);

        if (result.rowCount === 0) {
            res.status(400).send({status: 400, message: "Invalid box id"});
            db_client.query('ROLLBACK');
        } else {
            let query = `SELECT * FROM items WHERE box_id=$1;`;
            let values = [box_id];

            let result: QueryResult = await db_client.query(query, values);

            await db_client.query('COMMIT');

            res.status(200).send({status: 200, message: "Items retrieved", items: result.rows});
        }
    } catch (err) {
        await db_client.query('ROLLBACK');
        res.status(500).send({status: 500, message: "Error retrieving items"});
    } finally {
        db_client.release();
    }
};