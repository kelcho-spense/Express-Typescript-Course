import express, { Request, Response } from 'express';

const app = express();
const port = 8000;

//middlewares
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data



// RESPONSES
// res.json()
app.get('/users', (req, res) => {
  const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
  res.json(users);
});
// res.status()
app.get('/notfound', (req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});
//res.send()
app.get('/hello', (req, res) => {
  res.send('Hello, World!');
});

// res.redirect()
app.get('/old-route', (req, res) => {
  res.redirect('/hello');
});

// res.download()
app.get('/download', (req, res) => {
  res.download('./package.json', 'package.json', (err) => {
    if (err) {
      console.error(err);
    }
  });
});

// res.end()

app.get('/close', (req, res) => {
  res.status(204).end(); // 204 No Content
});





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});