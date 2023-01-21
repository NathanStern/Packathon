import { Express, Request, Response, Router } from 'express';
import { login } from '../controllers/user.controller';

export const user_routes = (app: Express) => {
    const router = Router();

    router.post('/login', login)

    router.use('/', (req: Request, res: Response) => {
        res.send({message: "User Routes"});
    });

    app.use('/users', router);
}