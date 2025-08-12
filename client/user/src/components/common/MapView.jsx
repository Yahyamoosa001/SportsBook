import React, { useState } from "react";
import { MapPin, ExternalLink, Navigation } from "lucide-react";

const MapView = ({ 
  mapEmbedUrl, 
  facilityName, 
  address, 
  coordinates,
  showDirections = true,
  height = "300px" 
}) => {
  const [mapError, setMapError] = useState(false);

  // Generate Google Maps directions URL
  const getDirectionsUrl = () => {
    if (coordinates?.latitude && coordinates?.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;
    } else if (address) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    }
    return null;
  };

  // Generate Google Maps search URL
  const getMapUrl = () => {
    if (coordinates?.latitude && coordinates?.longitude) {
      return `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;
    } else if (address) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }
    return null;
  };

  const handleMapError = () => {
    setMapError(true);
  };

  if (mapError || !mapEmbedUrl) {
    return (
      <div className="bg-base-200 border border-base-300 rounded-lg p-6 text-center" style={{ height }}>
        <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="font-semibold text-lg mb-2">{facilityName}</h3>
        <p className="text-gray-600 mb-4">{address}</p>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {getMapUrl() && (
            <a
              href={getMapUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              <ExternalLink size={16} />
              View on Maps
            </a>
          )}
          
          {showDirections && getDirectionsUrl() && (
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              <Navigation size={16} />
              Get Directions
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-base-300">
      <iframe
        src={mapEmbedUrl}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onError={handleMapError}
        title={`Map of ${facilityName}`}
      />
      
      {showDirections && (
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {getMapUrl() && (
            <a
              href={getMapUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm bg-white text-black hover:bg-gray-100 shadow-lg"
              title="View on Google Maps"
            >
              <ExternalLink size={14} />
            </a>
          )}
          
          {getDirectionsUrl() && (
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary shadow-lg"
              title="Get Directions"
            >
              <Navigation size={14} />
            </a>
          )}
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h3 className="text-white font-semibold text-sm">{facilityName}</h3>
        <p className="text-white/80 text-xs">{address}</p>
      </div>
    </div>
  );
};

export default MapView;
