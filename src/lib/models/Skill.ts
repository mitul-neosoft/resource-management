import mongoose, { Schema, type Model } from "mongoose";

export interface ISkill {
  employeeId: string;
  skillName: string;
  experience: number;
  level: string;
  createdAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    employeeId: { type: String, required: true, index: true },
    skillName: { type: String, required: true, trim: true },
    experience: { type: Number, required: true, min: 0 },
    level: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Skill: Model<ISkill> =
  (mongoose.models.Skill as Model<ISkill>) ||
  mongoose.model<ISkill>("Skill", SkillSchema);

export default Skill;
