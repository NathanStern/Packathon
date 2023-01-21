import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 3000;

console.log(process.env.sqlusername);

interface TestInterface {
    name: string;
    number?: number;
};

app.get('/:name', (req: Request, res: Response) => {
    res.send({name: req.params.name});
});

app.listen(port, () => {
  console.log(`Application is running on port ${port}.`);
});