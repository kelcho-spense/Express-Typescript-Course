import express, { Request, Response } from 'express';

const app = express();
const port = 8000;

app.use(express.json()); // Middleware to parse JSON requests

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});