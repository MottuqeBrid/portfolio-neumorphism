import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    details: { type: String, required: true },
    images: [{ type: String }],
    category: {
      type: String,
      enum: ["text", "image", "file", "other"],
      default: "text",
      required: true,
    },
    file: {
      url: { type: String },
      filename: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

type NoteInstance = mongoose.InferSchemaType<typeof noteSchema>;

export type { NoteInstance };

export { Note };
