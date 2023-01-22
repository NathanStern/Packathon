import { Express, Request, Response, Router } from 'express';

export const item_routes = (app: Express) => {
    const router = Router();

    // create item
    // delete item
    // edit item
    // get item
    // get all items in box

    router.use('/', (req: Request, res: Response) => {
        res.send({message: "Item Routes"});
    });

    app.use('/item', router);
}