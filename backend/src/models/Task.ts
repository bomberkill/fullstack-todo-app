import mongoose, { Schema, Document, Types } from 'mongoose';

export interface  Itask extends Document {
    title: string;
    userId: Types.ObjectId;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema: Schema<Itask> = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, {
    timestamps: true,
})

export default mongoose.model<Itask>('Task', TaskSchema);