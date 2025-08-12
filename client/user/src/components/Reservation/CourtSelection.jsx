import React from "react";
import { Clock, Users, Zap, IndianRupee } from "lucide-react";

const CourtSelection = ({ 
  courts, 
  selectedCourt, 
  onCourtSelect, 
  facilityOperatingHours 
}) => {
  const getSurfaceIcon = (surface) => {
    switch (surface) {
      case "Artificial Turf":
        return "🌱";
      case "Natural Grass":
        return "🌿";
      case "Concrete":
        return "🏗️";
      case "Wooden":
        return "🪵";
      case "Rubber":
        return "🔴";
      case "Clay":
        return "🟫";
      default:
        return "⚪";
    }
  };

  if (!courts || courts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No courts available for this facility.</p>
      </div>
    );
  }

  if (courts.length === 1) {
    // Auto-select if only one court
    const court = courts[0];
    if (!selectedCourt) {
      onCourtSelect(court);
    }
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Available Court</h3>
        <div className="card bg-base-100 border-2 border-primary">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="card-title text-lg">{court.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    {getSurfaceIcon(court.surface)} {court.surface}
                  </span>
                  <span className="flex items-center gap-1">
                    📏 {court.size?.length}m × {court.size?.width}m
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary flex items-center gap-1">
                  <IndianRupee size={20} />
                  {court.pricePerHour}/hr
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {court.sportTypes?.map((sport, index) => (
                  <span key={index} className="badge badge-outline badge-sm">
                    {sport}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {court.openTime || facilityOperatingHours?.openTime} - {court.closeTime || facilityOperatingHours?.closeTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Select a Court</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courts.map((court) => (
          <div
            key={court._id}
            className={`card bg-base-100 border-2 cursor-pointer transition-all hover:shadow-lg ${
              selectedCourt?._id === court._id 
                ? "border-primary bg-primary/5" 
                : "border-base-300 hover:border-primary/50"
            }`}
            onClick={() => onCourtSelect(court)}
          >
            <div className="card-body p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{court.name}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      {getSurfaceIcon(court.surface)} {court.surface}
                    </span>
                    <span className="flex items-center gap-1">
                      📏 {court.size?.length}m × {court.size?.width}m
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-primary flex items-center gap-1">
                    <IndianRupee size={16} />
                    {court.pricePerHour}
                  </div>
                  <div className="text-xs text-gray-500">per hour</div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {court.sportTypes?.map((sport, index) => (
                    <span key={index} className="badge badge-outline badge-sm">
                      {sport}
                    </span>
                  ))}
                </div>
              </div>
              
              {court.amenities && court.amenities.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {court.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="badge badge-ghost badge-xs">
                        {amenity}
                      </span>
                    ))}
                    {court.amenities.length > 3 && (
                      <span className="badge badge-ghost badge-xs">
                        +{court.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {court.openTime || facilityOperatingHours?.openTime} - {court.closeTime || facilityOperatingHours?.closeTime}
                </span>
                
                {selectedCourt?._id === court._id && (
                  <span className="flex items-center gap-1 text-primary font-medium">
                    ✓ Selected
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!selectedCourt && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Please select a court to continue with your booking
        </div>
      )}
    </div>
  );
};

export default CourtSelection;
