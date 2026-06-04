import mongoose from "mongoose";

const ResetTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const ResetToken = mongoose.models.ResetToken || mongoose.model("ResetToken", ResetTokenSchema);
export default ResetToken;
