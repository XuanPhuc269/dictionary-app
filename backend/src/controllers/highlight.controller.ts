import Highlight from '../models/Highlight';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

// GET
export const getAllHighlights = async (req: Request, res: Response): Promise<void> => {
    try {
        const highlights = await Highlight.find();
        res.status(200).json({ success: true, data: highlights });
    } catch (error) {
        console.error('Error fetching highlights:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getHighlightById = async (req: Request, res: Response): Promise<void> => {
    try {
        const highlight = await Highlight.findById(req.params.id);
        if (!highlight) {
            res.status(404).json({ success: false, message: 'Highlight not found' });
            return;
        }
        res.status(200).json({ success: true, data: highlight });
    } catch (error) {
        console.error('Error fetching highlight:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// POST
export const createHighlight = async (req: Request, res: Response): Promise<void> => {
    try {
        const highlight = new Highlight(req.body);
        await highlight.save();
        res.status(201).json({ success: true, data: highlight });
    } catch (error) {
        console.error('Eror creating highlight:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// PUT
export const updateHighlightById = async (req: Request, res: Response): Promise<void> => {
    try {
        const highlight = await Highlight.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!highlight) {
            res.status(404).json({ success: false, message: 'Highlight not found' });
            return;
        }
        res.status(200).json({ success: true, data: highlight });
    } catch (error) {
        console.error('Error updating highlight:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// DELETE
export const deleteHighlightById = async (req: Request, res: Response): Promise<void> => {
    try {
        const highlight = await Highlight.findByIdAndDelete(req.params.id);
        if (!highlight) {
            res.status(404).json({ success: false, message: 'Highlight not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Highlight deleted' });
    } catch (error) {
        console.error('Error deleting highlight:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

