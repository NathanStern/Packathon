import { Express, Request, Response, Router } from 'express';
import { create_user, get_user_profile } from '../controllers/user.controller';
import { tokenVerifier } from '../util/jwtVerifier';

export const user_routes = (app: Express) => {
    const router = Router();

    router.post('/create', create_user);

    router.use(tokenVerifier)

    router.get('/profile', get_user_profile);

    router.use('/', (req: Request, res: Response) => {
        res.send({message: "User Routes"});
    });

    app.use('/user', router);
}