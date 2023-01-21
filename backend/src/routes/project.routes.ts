import { Express, Request, Response, Router } from 'express';

export const project_routes = (app: Express) => {
    const router = Router();

    // router.get('/list');

    router.use('/', (req: Request, res: Response) => {
        res.send({message: "Project Routes"});
    });

    app.use('/project', router);
}