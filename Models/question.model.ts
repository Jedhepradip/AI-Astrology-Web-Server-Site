import { Schema, model, Document, Types } from "mongoose";

export interface IQuestion extends Document {
  userId: Types.ObjectId;
  questionText: string;
  aiAnswerText: string;
  aiAnswerAudioUrl: string;  
  createdAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  aiAnswerText: {
    type: String,
    required: true
  },
  aiAnswerAudioUrl: {
    type: String,
    required: true
  },  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Question = model<IQuestion>("Question", questionSchema);