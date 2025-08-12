import mongoose from "mongoose";

const turfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Facility name
    description: { type: String, required: true },
    location: { type: String, required: true }, // Address text
    state: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
    },
    mapEmbedUrl: { type: String, required: false }, // Google Maps embed URL
    image: { type: String, required: true }, // Main facility image
    galleryImages: [{ type: String }], // Additional images
    amenities: [{ type: String }], // Facility-wide amenities like "Parking", "Cafeteria", "Restrooms"
    contactInfo: {
      phone: { type: String },
      email: { type: String },
      website: { type: String },
    },
    operatingHours: {
      openTime: { type: String, required: true },
      closeTime: { type: String, required: true },
      closedDays: [{ type: String }], // e.g., ["Sunday"]
    },
    courts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Court" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    
    // Legacy fields for backward compatibility (will be deprecated)
    sportTypes: [{ type: String }], 
    pricePerHour: { type: Number },
    openTime: { type: String },
    closeTime: { type: String },
  },
  { timestamps: true }
);

// Virtual for average rating across all courts
turfSchema.virtual('avgRating').get(function() {
  if (!this.reviews || this.reviews.length === 0) return 0;
  // This would be calculated from actual review data
  return 0;
});

// Virtual for price range
turfSchema.virtual('priceRange').get(function() {
  if (!this.courts || this.courts.length === 0) return this.pricePerHour || 0;
  
  // This would need populated court data to calculate min/max prices
  return this.pricePerHour || 0;
});

// Ensure virtual fields are serialized
turfSchema.set('toJSON', { virtuals: true });
turfSchema.set('toObject', { virtuals: true });

const Turf = mongoose.model("Turf", turfSchema);

export default Turf;
