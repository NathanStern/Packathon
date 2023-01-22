import { Express, Request, Response, Router } from 'express';
import { tokenVerifier } from '../util/jwtVerifier';
import { create_room, get_rooms_for_project, delete_room, update_room, get_room } from '../controllers/room.controller';

export const room_routes = (app: Express) => {
    const router = Router();

    router.use(tokenVerifier);

    // get all rooms in project
    router.get('/list', get_rooms_for_project);

    // create room
    router.post('/create', create_room);

    // delete room
    router.delete('/:id', delete_room)

    // edit room
    router.put("/:id", update_room)

    // get room
    router.get('/:id', get_room)

    router.use('/', (req: Request, res: Response) => {
        res.send({message: "Room Routes"});
    });

    app.use('/room', router);
}