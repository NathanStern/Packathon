import { Express, Request, Response, Router } from 'express';

export const room_routes = (app: Express) => {
    const router = Router();

    // create room
    // delete room
    // edit room
    // get room
    // get all rooms in project

    router.use('/', (req: Request, res: Response) => {
        res.send({message: "Room Routes"});
    });

    app.use('/room', router);
}