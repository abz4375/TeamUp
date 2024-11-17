// models/taskModel.ts
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  assignees: [{ type: String }],
  fileUrl: { type: String },
  projectName: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Add this field
  createdAt: { type: Date, default: Date.now },
});

export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
