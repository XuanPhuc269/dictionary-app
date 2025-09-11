import mongoose, { Schema, Document, model } from 'mongoose';

export interface IHighlight extends Document {
    text: string;
    note?: string
    createdAt: Date;
}

const HighlightSchema: Schema = new Schema({
    text: { type: String, required: true },
    note: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Highlight = mongoose.model<IHighlight>('Highlight', HighlightSchema);

export default Highlight;
