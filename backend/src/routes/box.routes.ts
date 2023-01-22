import { Express, Request, Response, Router } from 'express';

export const box_routes = (app: Express) => {
    const router = Router();

    // create box
    // delete box
    // edit box
    // get box
    // get all boxes in room

    router.use('/', (req: Request, res: Response) => {
        res.send({message: "Box Routes"});
    });

    app.use('/box', router);
}