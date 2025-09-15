import mongoose, { Schema, Document } from 'mongoose';

export interface IHighlight extends Document {
    text: string;
    note?: string;
    color?: string;
    createdAt: Date;
    position: {
        paragraphIndex: number;
        startOffset: number;
        endOffset: number;
    }
}

const HighlightSchema: Schema = new Schema({
    text: { type: String, required: true },
    note: { type: String },
    color: { type: String, default: '#ffeb3b' },
    createdAt: { type: Date, default: Date.now },
    position: {
        paragraphIndex: { type: Number, required: true },
        startOffset: { type: Number, required: true },
        endOffset: { type: Number, required: true },
    },
});

const Highlight = mongoose.model<IHighlight>('Highlight', HighlightSchema);

export default Highlight;
