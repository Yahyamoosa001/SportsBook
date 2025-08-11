import mongoose from 'mongoose';

const courtSchema = new mongoose.Schema(
  {
    facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    name: { type: String, required: true },
    sportType: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    description: String,
    images: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Court = mongoose.model('Court', courtSchema);

