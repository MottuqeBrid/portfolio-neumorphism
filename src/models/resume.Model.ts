import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    url: { type: String, required: true },
    filename: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Resume = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

type ResumeInstance = mongoose.InferSchemaType<typeof resumeSchema>;

export type { ResumeInstance };

export { Resume };
