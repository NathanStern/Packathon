import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { db } from './db';
import { user_routes } from './routes/user.routes';
import { oauth_routes } from './routes/oauth.routes';
import { project_routes } from './routes/project.routes';

dotenv.config();
const app = express();
const port = 3000;

app.use(express.urlencoded());
app.use(express.json());

app.get('/hello', (req: Request, res: Response) => {
  let name = req.query.name;
  if (name) {
    res.send({message: `Hello ${name}`});
  }
});

app.get('/db-test', (req, res) => {
  db.query('SHOW TABLES;', (err, data) => {
    console.log(err, data);
    res.send({err: err, data: data.rows});
  });
})

// set up routers
user_routes(app);
oauth_routes(app);
project_routes(app);

app.listen(port, () => {
  console.log(`Application is running on port ${port}.`);
});