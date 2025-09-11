import express, { Request, Response } from 'express';

export const fetchLookup = async (req: Request, res: Response) => {
    try {
        const word = req.params.word.toLowerCase();
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        if (!response.ok) {
            return res.status(404).json({ message: 'Word not found' });
        }

        const data = await response.json();
        return res.json(data[0]);
    } catch (error) {
        console.error('Error fetching word:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};