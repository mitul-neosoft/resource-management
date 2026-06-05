import mongoose, { Schema, type Model, Types } from "mongoose";

export interface IAllocation {
  candidateId: Types.ObjectId;
  jobId: Types.ObjectId;
  allocatedBy: Types.ObjectId;
  createdAt: Date;
}

const AllocationSchema = new Schema<IAllocation>(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "BenchCandidate",
      required: true,
    },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    allocatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Allocation: Model<IAllocation> =
  (mongoose.models.Allocation as Model<IAllocation>) ||
  mongoose.model<IAllocation>("Allocation", AllocationSchema);

export default Allocation;
