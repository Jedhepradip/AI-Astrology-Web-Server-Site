import { Schema, model, Document } from "mongoose";

interface IPaymentHistory {
  amount: number;
  date: Date;
  transactionId: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "superadmin";
  coins: number;
  paymentHistory: IPaymentHistory[];
  birthDate: Date;
  birthTime?: string;
  birthPlace?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user"
    },
    birthDate: {
      type: Date,
      required: false,
    },
    birthTime: {
      type: String,
      required: false,
    },
    birthPlace: {
      type: String,
      required: false
    },
    coins: {
      type: Number,
      default: 10
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
