import mongoose from 'mongoose';

const suspectSchema = new mongoose.Schema({
  suspectId: String, name: String, age: Number, occupation: String, background: String,
  relationship: String, motive: String, alibi: String, suspiciousBehavior: String, publicProfile: String
}, { _id: false });
const evidenceSchema = new mongoose.Schema({
  evidenceId: String, title: String, type: String, description: String, content: mongoose.Schema.Types.Mixed,
  timestamp: String, relatedSuspectIds: [String], location: String, isSimulation: Boolean
}, { _id: false });

const mysterySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true }, scenario: String, category: String, difficulty: String,
  status: { type: String, default: 'active' }, description: String,
  incident: { location: String, date: String, time: String, description: String },
  timeline: [mongoose.Schema.Types.Mixed], suspects: [suspectSchema], evidence: [evidenceSchema],
  solution: { type: new mongoose.Schema({ culpritId: String, motive: String, method: String, explanation: String, supportingEvidenceIds: [String] }, { _id: false }), select: false },
  generationStatus: { type: String, default: 'complete' }
}, { timestamps: true });

export default mongoose.model('Mystery', mysterySchema);
