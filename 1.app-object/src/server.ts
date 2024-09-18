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

// POST
app.post('/users', (req: Request, res: Response) => {
  const { name, email } = req.body; 
  res.status(201).json({ id: 1, name, email });
});

// PUT
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  // Update the user in the database here
  res.json({ message: `User ${userId} updated`, name, email });
});

//DELETE
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  // Remove the user from the database here
  res.status(200).json({ message: `User ${userId} deleted` });
});

//REQUEST PARAMS
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ id: userId, name: 'John Doe' });
});

// REQUEST QUERY
app.get('/search', (req, res) => {
  const query = req.query.q; // Example: /search?q=express
  res.json({ message: `Searching for ${query}` });
});







app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});