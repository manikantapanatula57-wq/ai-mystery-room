import mongoose from 'mongoose';

const investigationSchema = new mongoose.Schema({
  mysteryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mystery', required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  inspectedEvidenceIds: [String], reviewedSuspectIds: [String],
  notes: [{ content: { type: String, maxlength: 4000 }, createdAt: Date, updatedAt: Date }],
  selectedSuspectId: String, userReasoning: String, score: Number, evaluation: mongoose.Schema.Types.Mixed,
  status: { type: String, default: 'active' }, startedAt: { type: Date, default: Date.now }, completedAt: Date
}, { timestamps: true });

export default mongoose.model('Investigation', investigationSchema);
