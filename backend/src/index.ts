import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import lookupRoutes from './routes/lookup.route';
import highlightRoutes from './routes/highlight.route';

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.use('/api/lookup', lookupRoutes);
app.use('/api/highlight', highlightRoutes);

// app.use(cors());

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});