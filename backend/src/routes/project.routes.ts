import { Express, Request, Response, Router } from 'express';
import { get_user_profile } from '../controllers/user.controller';

export const user_routes = (app: Express) => {
    const router = Router();

    router.get('/profile', get_user_profile);

    router.use('/', (req: Request, res: Response) => {
        res.send({message: "User Routes"});
    });

    app.use('/users', router);
}