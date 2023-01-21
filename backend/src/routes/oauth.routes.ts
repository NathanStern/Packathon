import { Express, Request, Response, Router } from 'express';
import { authorize, token } from '../controllers/oauth.controller';

export const oauth_routes = (app: Express) => {
    const router = Router();

    router.post('/authorize', authorize);

    router.get('/token', token);

    router.use('/', (req: Request, res: Response) => {
        res.send({message: "OAuth Routes"});
    });

    app.use('/oauth', router);
}