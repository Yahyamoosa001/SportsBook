import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormField, Button } from "@components/common";
import { Plus, Trash2, MapPin, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

const facilitySchema = yup.object().shape({
  name: yup
    .string()
    .required("Enter the facility name")
    .min(3, "Name must be at least 3 characters long"),
  description: yup
    .string()
    .required("Enter the facility description")
    .min(10, "Description must be at least 10 characters long"),
  location: yup
    .string()
    .required("Enter the facility address")
    .min(5, "Address must be at least 5 characters long"),
  state: yup
    .string()
    .required("Enter the state where facility is located")
    .min(2, "State must be at least 2 characters long"),
  mapEmbedUrl: yup
    .string()
    .url("Please enter a valid Google Maps embed URL")
    .optional(),
  amenities: yup
    .array()
    .of(yup.string())
    .min(1, "Add at least one facility amenity"),
  contactInfo: yup.object().shape({
    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
      .required("Phone number is required"),
    email: yup
      .string()
      .email("Enter a valid email")
      .optional(),
    website: yup
      .string()
      .url("Enter a valid website URL")
      .optional(),
  }),
  operatingHours: yup.object().shape({
    openTime: yup.string().required("Opening time is required"),
    closeTime: yup.string().required("Closing time is required"),
  }),
  courts: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Court name is required"),
        sportTypes: yup
          .array()
          .of(yup.string())
          .min(1, "At least one sport type is required"),
        pricePerHour: yup
          .number()
          .required("Price per hour is required")
          .min(100, "Price must be at least ₹100")
          .max(5000, "Price must be at most ₹5000"),
        surface: yup.string().required("Surface type is required"),
        size: yup.object().shape({
          length: yup.number().min(10, "Length must be at least 10m"),
          width: yup.number().min(5, "Width must be at least 5m"),
        }),
      })
    )
    .min(1, "Add at least one court"),
});

const AddFacilityForm = () => {
  const [loading, setLoading] = useState(false);
  const [facilityAmenities, setFacilityAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(facilitySchema),
    defaultValues: {
      courts: [
        {
          name: "Court 1",
          sportTypes: [],
          pricePerHour: 500,
          surface: "Artificial Turf",
          size: { length: 40, width: 20 },
          amenities: [],
        }
      ],
      amenities: [],
      contactInfo: {},
      operatingHours: {},
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "courts",
  });

  const addAmenity = () => {
    if (newAmenity && !facilityAmenities.includes(newAmenity)) {
      const updated = [...facilityAmenities, newAmenity];
      setFacilityAmenities(updated);
      setValue("amenities", updated);
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenityToRemove) => {
    const updated = facilityAmenities.filter(amenity => amenity !== amenityToRemove);
    setFacilityAmenities(updated);
    setValue("amenities", updated);
  };

  const addCourt = () => {
    append({
      name: `Court ${fields.length + 1}`,
      sportTypes: [],
      pricePerHour: 500,
      surface: "Artificial Turf",
      size: { length: 40, width: 20 },
      amenities: [],
    });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log("Facility Data:", data);
      // TODO: Send to backend API
      toast.success("Facility created successfully!");
    } catch (error) {
      toast.error("Error creating facility");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Add New Sports Facility</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Facility Information */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Facility Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Facility Name"
                name="name"
                type="text"
                register={register}
                error={errors.name}
                placeholder="e.g., Premier Sports Complex"
              />
              
              <FormField
                label="State"
                name="state"
                type="text"
                register={register}
                error={errors.state}
                placeholder="e.g., Maharashtra"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register("description")}
                className="textarea textarea-bordered h-24"
                placeholder="Describe your sports facility, its features, and what makes it special..."
              />
              {errors.description && (
                <span className="text-error text-xs mt-1">
                  {errors.description.message}
                </span>
              )}
            </div>

            <FormField
              label="Full Address"
              name="location"
              type="text"
              register={register}
              error={errors.location}
              placeholder="Complete address with landmarks"
            />
          </div>
        </div>

        {/* Map Integration */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4 flex items-center gap-2">
              <MapPin size={24} />
              Location & Map
            </h2>
            
            <div className="space-y-4">
              <FormField
                label="Google Maps Embed URL (Optional)"
                name="mapEmbedUrl"
                type="url"
                register={register}
                error={errors.mapEmbedUrl}
                placeholder="https://maps.google.com/maps?embed=..."
              />
              
              <div className="alert alert-info">
                <div>
                  <h3 className="font-bold">How to get Google Maps embed URL:</h3>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Go to Google Maps and search for your facility</li>
                    <li>Click "Share" button</li>
                    <li>Select "Embed a map" tab</li>
                    <li>Copy the URL from the iframe src attribute</li>
                    <li>Paste it in the field above</li>
                  </ol>
                </div>
              </div>
              
              {watch("mapEmbedUrl") && (
                <div className="mt-4">
                  <label className="label">
                    <span className="label-text">Map Preview</span>
                  </label>
                  <iframe
                    src={watch("mapEmbedUrl")}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Phone Number"
                name="contactInfo.phone"
                type="tel"
                register={register}
                error={errors.contactInfo?.phone}
                placeholder="9876543210"
              />
              
              <FormField
                label="Email (Optional)"
                name="contactInfo.email"
                type="email"
                register={register}
                error={errors.contactInfo?.email}
                placeholder="facility@example.com"
              />
              
              <FormField
                label="Website (Optional)"
                name="contactInfo.website"
                type="url"
                register={register}
                error={errors.contactInfo?.website}
                placeholder="https://yourfacility.com"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Operating Hours</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Opening Time"
                name="operatingHours.openTime"
                type="time"
                register={register}
                error={errors.operatingHours?.openTime}
              />
              
              <FormField
                label="Closing Time"
                name="operatingHours.closeTime"
                type="time"
                register={register}
                error={errors.operatingHours?.closeTime}
              />
            </div>
          </div>
        </div>

        {/* Facility Amenities */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Facility Amenities</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                className="input input-bordered flex-1"
                placeholder="Add amenity (e.g., Parking, Cafeteria, Restrooms)"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="btn btn-primary"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {facilityAmenities.map((amenity, index) => (
                <div key={index} className="badge badge-lg gap-2">
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="text-error"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            
            {errors.amenities && (
              <span className="text-error text-xs mt-2">
                {errors.amenities.message}
              </span>
            )}
          </div>
        </div>

        {/* Courts Section */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-xl">Courts/Playing Areas</h2>
              <button
                type="button"
                onClick={addCourt}
                className="btn btn-primary btn-sm"
              >
                <Plus size={16} />
                Add Court
              </button>
            </div>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <CourtForm
                  key={field.id}
                  index={index}
                  register={register}
                  errors={errors}
                  onRemove={() => remove(index)}
                  canRemove={fields.length > 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="btn-primary btn-lg"
            loading={loading}
          >
            Create Facility
          </Button>
        </div>
      </form>
    </div>
  );
};

// Court Form Component
const CourtForm = ({ index, register, errors, onRemove, canRemove }) => {
  const [courtSportTypes, setCourtSportTypes] = useState([]);
  const [newSportType, setNewSportType] = useState("");

  const addSportType = () => {
    if (newSportType && !courtSportTypes.includes(newSportType)) {
      setCourtSportTypes([...courtSportTypes, newSportType]);
      setNewSportType("");
    }
  };

  const removeSportType = (sport) => {
    setCourtSportTypes(courtSportTypes.filter(s => s !== sport));
  };

  return (
    <div className="border border-base-300 rounded-lg p-4 relative">
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 btn btn-ghost btn-sm text-error"
        >
          <Trash2 size={16} />
        </button>
      )}
      
      <h3 className="font-semibold text-lg mb-4">Court {index + 1}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          label="Court Name"
          name={`courts.${index}.name`}
          type="text"
          register={register}
          error={errors.courts?.[index]?.name}
          placeholder="e.g., Main Football Field"
        />
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Surface Type</span>
          </label>
          <select
            {...register(`courts.${index}.surface`)}
            className="select select-bordered"
          >
            <option value="Artificial Turf">Artificial Turf</option>
            <option value="Natural Grass">Natural Grass</option>
            <option value="Concrete">Concrete</option>
            <option value="Wooden">Wooden</option>
            <option value="Rubber">Rubber</option>
            <option value="Clay">Clay</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <FormField
          label="Price per Hour (₹)"
          name={`courts.${index}.pricePerHour`}
          type="number"
          register={register}
          error={errors.courts?.[index]?.pricePerHour}
          placeholder="500"
        />
        
        <FormField
          label="Length (meters)"
          name={`courts.${index}.size.length`}
          type="number"
          register={register}
          error={errors.courts?.[index]?.size?.length}
          placeholder="40"
        />
        
        <FormField
          label="Width (meters)"
          name={`courts.${index}.size.width`}
          type="number"
          register={register}
          error={errors.courts?.[index]?.size?.width}
          placeholder="20"
        />
      </div>

      {/* Sport Types for this court */}
      <div className="mb-4">
        <label className="label">
          <span className="label-text">Sports Available on this Court</span>
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSportType}
            onChange={(e) => setNewSportType(e.target.value)}
            className="input input-bordered input-sm flex-1"
            placeholder="Add sport type"
          />
          <button
            type="button"
            onClick={addSportType}
            className="btn btn-primary btn-sm"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {courtSportTypes.map((sport, sportIndex) => (
            <div key={sportIndex} className="badge badge-outline gap-2">
              {sport}
              <button
                type="button"
                onClick={() => removeSportType(sport)}
                className="text-error"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddFacilityForm;
