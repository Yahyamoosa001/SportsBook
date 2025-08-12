import React from "react";
import { MapPin, Clock, Star, Calendar } from "lucide-react";
import { format } from "date-fns";

const Turf = ({ turf }) => {
  return (
    <div className="card bg-base-100 shadow-xl w-full hover:shadow-2xl transition-shadow duration-300">
      <figure className="relative h-48 sm:h-56 md:h-64">
        <img
          src={turf.image}
          alt={turf.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-primary text-white font-semibold px-3 py-1 m-2 rounded-full shadow-lg">
          ₹{turf.pricePerHour}/hr
        </div>
        {turf.avgRating > 0 && (
          <div className="absolute top-0 left-0 bg-yellow-400 text-black font-semibold px-3 py-1 m-2 rounded-full shadow-lg flex items-center gap-1">
            <Star size={14} className="fill-black" />
            {turf.avgRating.toFixed(1)}
          </div>
        )}
      </figure>
      <div className="card-body p-4 sm:p-6">
        <h2 className="card-title text-lg sm:text-xl mb-2">{turf.name}</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          {turf.description}
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <MapPin size={18} className="mr-2 text-primary" />
            <span>{turf.location}</span>
          </div>
          <div className="flex items-center">
            <Clock size={18} className="mr-2 text-primary" />
            <span>
              {turf.openTime} - {turf.closeTime}
            </span>
          </div>
          <div className="flex items-center">
            <Star size={18} className="mr-2 text-yellow-400" />
            <span className="flex items-center gap-1">
              {turf.avgRating > 0 ? (
                <>
                  {turf.avgRating.toFixed(1)}
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={`${
                          i < Math.floor(turf.avgRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                "No ratings yet"
              )}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar size={18} className="mr-2 text-primary" />
            <span>{format(new Date(turf.createdAt), "dd MMM yyyy")}</span>
          </div>
        </div>
         
      </div>
    </div>
  );
};

export default Turf;
