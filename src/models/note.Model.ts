import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    editorData: { type: String, default: "" }, // New field to store the editor data as a JSON string
    images: [{ type: String }],
    files: [
      {
        url: { type: String },
        filename: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

type NoteInstance = mongoose.InferSchemaType<typeof noteSchema>;

export type { NoteInstance };

export { Note };
