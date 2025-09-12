import mongoose, { Schema, Document } from 'mongoose';

export interface IHighlight extends Document {
    text: string;
    note?: string;
    color?: string;
    createdAt: Date;
}

const HighlightSchema: Schema = new Schema({
    text: { type: String, required: true },
    note: { type: String },
    color: { type: String, default: '#ffeb3b' },
    createdAt: { type: Date, default: Date.now },
});

const Highlight = mongoose.model<IHighlight>('Highlight', HighlightSchema);

export default Highlight;
