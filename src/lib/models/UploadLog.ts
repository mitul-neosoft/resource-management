import mongoose, { Schema, type Model, Types } from "mongoose";

export interface IUploadLog {
  type: "bench" | "jobs";
  fileName: string;
  success: number;
  failed: number;
  total: number;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
}

const UploadLogSchema = new Schema<IUploadLog>(
  {
    type: { type: String, enum: ["bench", "jobs"], required: true },
    fileName: { type: String, required: true },
    success: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const UploadLog: Model<IUploadLog> =
  (mongoose.models.UploadLog as Model<IUploadLog>) ||
  mongoose.model<IUploadLog>("UploadLog", UploadLogSchema);

export default UploadLog;
