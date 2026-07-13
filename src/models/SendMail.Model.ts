import mongoose from "mongoose";

const SendEmailSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    messageId: { type: String, required: false },
    isRead: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const SendEmail =
  mongoose.models.SendEmail || mongoose.model("SendEmail", SendEmailSchema);

export type SendEmailInstance = {
  _id: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  messageId: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};
