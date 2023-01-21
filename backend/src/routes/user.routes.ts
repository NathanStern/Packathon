import { Express, Request, Response, Router } from 'express';

export const user_routes = (app: Express) => {
    const router = Router();

    router.use('/', (req: Request, res: Response) => {
        res.send({message: "User Routes"});
    });

    app.use('/users', router);
}