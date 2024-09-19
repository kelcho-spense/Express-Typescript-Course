import 'dotenv/config';
import express, { Request, Response } from 'express';
import userRoutes from './routes/userRoutes';


const app = express();
const port = Number(process.env.PORT);

//middlewares
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

app.use('/api/users', userRoutes);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});