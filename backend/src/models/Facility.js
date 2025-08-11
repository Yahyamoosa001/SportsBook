import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    address: String,
    city: String,
    state: String,
    coordinates: { lat: Number, lng: Number },
  },
  { _id: false }
);

const operatingDaySchema = new mongoose.Schema(
  { open: String, close: String, isOpen: Boolean },
  { _id: false }
);

const operatingHoursSchema = new mongoose.Schema(
  {
    monday: operatingDaySchema,
    tuesday: operatingDaySchema,
    wednesday: operatingDaySchema,
    thursday: operatingDaySchema,
    friday: operatingDaySchema,
    saturday: operatingDaySchema,
    sunday: operatingDaySchema,
  },
  { _id: false }
);

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: locationSchema,
    sportsTypes: [String],
    amenities: [String],
    images: [String],
    operatingHours: operatingHoursSchema,
    contactInfo: { phone: String, email: String },
    rating: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    adminComments: String,
  },
  { timestamps: true }
);

export const Facility = mongoose.model('Facility', facilitySchema);

