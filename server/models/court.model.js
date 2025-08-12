import mongoose from "mongoose";

const courtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Court 1", "Basketball Court A"
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turf", // Still referencing "Turf" for backward compatibility
      required: true,
    },
    sportTypes: [{ type: String, required: true }], // e.g., ["Football", "Cricket"]
    pricePerHour: { type: Number, required: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    surface: { 
      type: String, 
      enum: ["Natural Grass", "Artificial Turf", "Concrete", "Wooden", "Rubber", "Clay"],
      default: "Artificial Turf"
    },
    size: {
      length: { type: Number }, // in meters
      width: { type: Number },  // in meters
    },
    amenities: [{ type: String }], // e.g., ["Floodlights", "Changing Room", "Parking"]
    isActive: { type: Boolean, default: true },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

// Virtual for average rating
courtSchema.virtual('avgRating').get(function() {
  if (!this.reviews || this.reviews.length === 0) return 0;
  
  // This would need to be populated with actual review data
  // For now, return 0, but in practice you'd calculate from populated reviews
  return 0;
});

// Ensure virtual fields are serialized
courtSchema.set('toJSON', { virtuals: true });
courtSchema.set('toObject', { virtuals: true });

const Court = mongoose.model("Court", courtSchema);

export default Court;
