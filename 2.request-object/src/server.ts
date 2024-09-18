import express, { Request, Response } from 'express';

const app = express();
const port = 8000;

//middlewares
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data



//GET
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
});

// Query Parameters
app.get('/users', (req, res) => {
  const { name, age } = req.query;  //users?name=John&age=25
  res.json({ name, age });
});

// Route Parameters
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  // Logic to fetch user by id
  res.json({ message: `User ID: ${id}` });
});







app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});