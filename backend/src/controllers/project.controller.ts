import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { db } from '../db';
import { userIdScraper } from '../util/jwtVerifier';

interface ProjectInfo {
    id?: string;
    name: string;
    user_id: string;
};

export const create_project = (req: Request, res: Response) => {
    const project_info: ProjectInfo = req.body;
    const user_id = userIdScraper(req.headers.authorization);

    if (!project_info.name) {
        res.status(400).send({ status: 400, message: "Invalid project info" });
        return;
    }

    db.query('INSERT INTO projects (name, user_id) VALUES ($1, $2)', [project_info.name, user_id])
        .then((data: QueryResult) => {
            res.send({ status: 200, message: "Success" });
        })
        .catch((e: Error) => {
            console.log(e.message);
            res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
        });
};

export const delete_project = (req: Request, res: Response) => {
    const project_id = req.params.id;
    const user_id = userIdScraper(req.headers.authorization);

    db.query('DELETE FROM projects WHERE id=$1 AND user_id=$2', [project_id, user_id])
        .then((data: QueryResult) => {
            res.send({ status: 200, message: "Success" });
        })
        .catch((e: Error) => {
            console.log(e.message);
            res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
        });
};

export const update_project = (req: Request, res: Response) => {
    const project_id = req.params.id;
    const project_info: ProjectInfo = req.body;
    const user_id = userIdScraper(req.headers.authorization);

    if (!project_info.name) {
        res.status(400).send({ status: 400, message: "Invalid project info" });
        return;
    }

    db.query('UPDATE projects SET name=$1 WHERE id=$2 AND user_id=$3', [project_info.name, project_id, user_id])
        .then((data: QueryResult) => {
            res.send({ status: 200, message: "Success" });
        })
        .catch((e: Error) => {
            console.log(e.message);
            res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
        });
};

export const get_project = (req: Request, res: Response) => {
    const project_id = req.params.id;
    const user_id = userIdScraper(req.headers.authorization);

    db.query('SELECT * FROM projects WHERE id=$1 AND user_id=$2', [project_id, user_id])
        .then((data: QueryResult) => {
            if (data.rows.length === 0) {
                res.status(404).send({ status: 404, message: "Project not found" });
                return;
            }
            res.send({ status: 200, message: "Success", data: data.rows[0] });
        })
        .catch((e: Error) => {
            console.log(e.message);
            res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
        });
}

export const add_user_to_project = (req: Request, res: Response) => {
    const user_id = userIdScraper(req.headers.authorization);
    const project_id = req.body.project_id;

    // get the username or email of the person to add from the body of the request
    const email = req.body.email;
    const username = req.body.username;

    if (!email && !username) {
        res.status(400).send({ status: 400, message: "Invalid request" });
        return;
    } else if (email) {
        // if email is provided, query the users table for the user with that email
        db.query('SELECT id FROM users WHERE email=$1', [email])
            .then((data: QueryResult) => {
                if (data.rows.length === 0) {
                    res.status(404).send({ status: 404, message: "User not found" });
                    return;
                }
                // if the user is found, add the user to the project
                const user_to_add_id = data.rows[0].id;
                db.query('INSERT INTO allowlist (project_id, user_id) VALUES ($1, $2)', [project_id, user_to_add_id])
                    .then((data: QueryResult) => {
                        res.send({ status: 200, message: "Success" });
                    })
                    .catch((e: Error) => {
                        console.log(e.message);
                        res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
                    });
            })
            .catch((e: Error) => {
                console.log(e.message);
                res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
            });
    } else {
        // if username is provided, query the users table for the user with that username
        db.query('SELECT id FROM users WHERE username=$1', [username])
            .then((data: QueryResult) => {
                if (data.rows.length === 0) {
                    res.status(404).send({ status: 404, message: "User not found" });
                    return;
                }
                // if the user is found, add the user to the project
                const user_to_add_id = data.rows[0].id;
                console.log(user_to_add_id);
                db.query('INSERT INTO allowlist (project_id, user_id) VALUES ($1, $2)', [project_id, user_to_add_id])
                    .then((data: QueryResult) => {
                        res.send({ status: 200, message: "Success" });
                    })
                    .catch((e: Error) => {
                        console.log(e.message);
                        res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
                    });
            })
            .catch((e: Error) => {
                console.log(e.message);
                res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
            });
    }
}

export const get_user_projects = (req: Request, res: Response) => {
    const user_id = userIdScraper(req.headers.authorization);

    const query_string = `
        SELECT
            p.id as project_id,
            p.name as name,
            u.username as owner
        FROM
            projects p,
            users u
        WHERE
            p.user_id = $1
            AND p.user_id = u.id
        
        UNION

        SELECT
            p.id as project_id,
            p.name as name,
            u.username as owner
        FROM
            projects p,
            allowlist a,
            users u
        WHERE
            a.user_id = $1
            AND a.project_id = p.id
            AND p.user_id = u.id
    `;

    const query_values = [user_id];

    db.query(query_string, query_values)
        .then((data: QueryResult) => {
            res.send({ status: 200, message: "Success", data: data.rows });
        })
        .catch((e: Error) => {
            console.log(e.message);
            res.status(500).send({ status: 500, message: `Internal server error: ${e.message}` });
        });
}