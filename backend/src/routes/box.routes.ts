import { Express, Request, Response, Router } from 'express';
import { tokenVerifier } from '../util/jwtVerifier';
import { create_box, delete_box, update_box, get_box, get_all_boxes_in_room } from '../controllers/box.controller';

export const box_routes = (app: Express) => {
    const router = Router();
    
    // auth middleware
    router.use(tokenVerifier);

    // get all boxes in room
    router.get('/list', get_all_boxes_in_room)

    // create box
    router.post('/create', create_box);

    // delete box
    router.delete('/:id', delete_box);

    // edit box
    router.put('/:id', update_box);

    // get box
    router.get('/:id', get_box);

    router.use('/', (req: Request, res: Response) => {
        res.send({message: "Box Routes"});
    });

    app.use('/box', router);
}