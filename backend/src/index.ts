import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());

app.get('/api/dictionary/:word', async (req: Request, res: Response) => {
  try {
    const word = req.params.word.toLowerCase();
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    if(!response.ok) {
      return res.status(404).json({ message: 'Word not found' });
    }
    const data = await response.json();
    return res.json(data[0]);
  } catch (error) {
    console.error('Error fetching word:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});