import { Express, Request, Response, Router } from 'express';
import { create_item, delete_item, update_item, get_item, get_items_in_box } from '../controllers/item.controller';
import { tokenVerifier } from '../util/jwtVerifier';

export const item_routes = (app: Express) => {
    const router = Router();

    // auth middleware
    router.use(tokenVerifier);

    // get all items in box
    router.get('/list', get_items_in_box);
    
    // create item
    router.post('/create', create_item);

    // delete item
    router.delete('/:id', delete_item);

    // edit item
    router.put('/:id', update_item)
    
    // get item
    router.get('/:id', get_item);

    router.use('/', (req: Request, res: Response) => {
        res.send({message: "Item Routes"});
    });

    app.use('/item', router);
}