import mongoose, { Schema, Document } from "mongoose";

export interface IColumn extends Document {
  name: string;
  boardId: Schema.Types.ObjectId;
  order: number;
  jobApplications: mongoose.Types.ObjectId[]; // pluralized correctly
  createdAt: Date;
  updatedAt: Date;
}

const ColumnSchema = new Schema<IColumn>(
  {
    name: { type: String, required: true },

    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    jobApplications: [
      {
        type: Schema.Types.ObjectId,
        ref: "JobApplication",
      },
    ],
  },
  { timestamps: true },
);

// Prevent model overwrite issues in Next.js (hot reload)
const Column =
  mongoose.models.Column || mongoose.model<IColumn>("Column", ColumnSchema);

export default Column;
