import mongoose from "mongoose";

export const messagesSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timesTamps: true,
    strict: true,
  }
);
