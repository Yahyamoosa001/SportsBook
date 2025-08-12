import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Star, MapPin, IndianRupee, Clock, Users, Zap } from "lucide-react";

const TurfCard = ({ turf }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  
  // Calculate price range for facilities with multiple courts
  const getPriceDisplay = () => {
    if (turf.courts && turf.courts.length > 0) {
      const prices = turf.courts.map(court => court.pricePerHour);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      if (minPrice === maxPrice) {
        return `${minPrice}/hr`;
      } else {
        return `${minPrice}-${maxPrice}/hr`;
      }
    }
    return `${turf.pricePerHour || 0}/hr`;
  };

  // Get total number of courts
  const getTotalCourts = () => {
    return turf.courts?.length || 1;
  };

  // Get all unique sport types from all courts
  const getAllSportTypes = () => {
    if (turf.courts && turf.courts.length > 0) {
      const allSports = turf.courts.flatMap(court => court.sportTypes || []);
      return [...new Set(allSports)];
    }
    return turf.sportTypes || [];
  };
  
  return (
    <div className="card bg-base-100 shadow-xl animate-bounce-fade-in hover:shadow-2xl transition-shadow duration-300">
      <figure className="relative">
        <img
          src={turf.image}
          alt={turf.name}
          className="w-full h-48 object-cover"
        />
        {/* Price Badge */}
        <div className="absolute top-2 right-2 bg-primary text-white font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
          <IndianRupee size={14} />
          {getPriceDisplay()}
        </div>
        {/* Rating Badge */}
        {turf.avgRating > 0 && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Star size={14} className="fill-black" />
            {turf.avgRating.toFixed(1)}
          </div>
        )}
        {/* Courts Count Badge */}
        {getTotalCourts() > 1 && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Users size={14} />
            {getTotalCourts()} Courts
          </div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{turf.name}</h2>
        
        {/* Location & State */}
        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
          <MapPin size={16} />
          <span>{turf.location}</span>
          {turf.state && (
            <>
              <span className="mx-1">•</span>
              <span className="font-medium">{turf.state}</span>
            </>
          )}
        </div>

        {/* Sport Types */}
        <div className="flex flex-wrap gap-2 mt-2">
          {getAllSportTypes().slice(0, 4).map((sport, index) => (
            <span key={index} className="badge badge-outline">
              {sport}
            </span>
          ))}
          {getAllSportTypes().length > 4 && (
            <span className="badge badge-ghost">
              +{getAllSportTypes().length - 4} more
            </span>
          )}
        </div>

        {/* Operating Hours */}
        <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
          <Clock size={16} />
          <span>Open: {turf.operatingHours?.openTime || turf.openTime} - {turf.operatingHours?.closeTime || turf.closeTime}</span>
        </div>

        {/* Amenities Preview */}
        {turf.amenities && turf.amenities.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
            <Zap size={16} />
            <span>{turf.amenities.slice(0, 2).join(", ")}</span>
            {turf.amenities.length > 2 && (
              <span className="text-gray-400">+{turf.amenities.length - 2} more</span>
            )}
          </div>
        )}

        {/* Rating Stars */}
        {turf.avgRating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.floor(turf.avgRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({turf.avgRating.toFixed(1)})
            </span>
          </div>
        )}

        <div className="card-actions justify-between items-center mt-4">
          <div className="text-lg font-bold text-primary flex items-center gap-1">
            <IndianRupee size={18} />
            {getPriceDisplay().replace('/hr', '/hour')}
          </div>
          <Link
            to={isLoggedIn ? `/auth/facility/${turf._id}` : `/facility/${turf._id}`}
            className="btn btn-primary btn-sm"
          >
            View Facility
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TurfCard;
