import { Schema, model, Document, Types } from "mongoose";

export interface IPayment extends Document {
    userId: Types.ObjectId;
    amount: number;
    createdAt: Date;
}

const paymentSchema = new Schema<IPayment>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Payment = model<IPayment>("Payment", paymentSchema);