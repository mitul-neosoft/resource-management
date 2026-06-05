import mongoose, { Schema, type Model } from "mongoose";

export interface IResetToken {
  user: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const ResetTokenSchema = new Schema<IResetToken>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const ResetToken: Model<IResetToken> =
  (mongoose.models.ResetToken as Model<IResetToken>) ||
  mongoose.model<IResetToken>("ResetToken", ResetTokenSchema);

export default ResetToken;
