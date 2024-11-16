// models/taskModel.ts
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  fileUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
