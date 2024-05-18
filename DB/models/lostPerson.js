import mongoose from 'mongoose';

const lostPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String },
  location: { type: String },
  governorate: { type: String },
  phone: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  imageUrl: { type: String } 
}, { timestamps: true });

const LostPerson = mongoose.model('LostPerson', lostPersonSchema);

export default LostPerson;
