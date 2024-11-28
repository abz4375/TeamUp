// models/taskModel.ts
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  assignees: [{ type: String }],
  fileUrl: { type: String },
  projectName: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
  submitted: { type: Boolean, default: false },
  approvals: [{ type: String }], // Array of maintainer emails who approved
});


export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
