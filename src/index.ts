import express, { Request, Response } from 'express';
import updateCurrentPrice_route from './handlers/updateCurrentPrice';
import cors from 'cors';

const port = 3000 || process.env.PORT;
const app: express.Application = express();

app.use(cors());
app.use(express.json());

app.get('/', function (_req: Request, res: Response) {
  res.send('Welcome.');
});

updateCurrentPrice_route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
