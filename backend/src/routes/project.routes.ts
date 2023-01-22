import { Express, Request, Response, Router } from 'express';
import { tokenVerifier } from '../util/jwtVerifier';
import { create_project, delete_project, update_project, get_project, add_user_to_project, get_user_projects } from '../controllers/project.controller';

export const project_routes = (app: Express) => {
    const router = Router();

    router.use(tokenVerifier);

    // list projects for user (owned or shared with)
    router.get('/list', get_user_projects);

    // create project
    router.post('/create', create_project);

    // delete project
    router.delete('/:id', delete_project);

    // edit project
    router.put('/:id', update_project);

    // get project
    router.get('/:id', get_project)

    // add user to project (username or email)
    router.post('/add', add_user_to_project);

    router.use('/', (req: Request, res: Response) => {
        res.send({ message: "Project Routes" });
    });

    app.use('/project', router);
}