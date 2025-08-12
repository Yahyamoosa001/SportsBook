import { useState } from "react";
import { Filter, X, Star, DollarSign } from "lucide-react";

const TurfFilters = ({ onFiltersChange, turfData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 10000 },
    rating: 0,
    sortBy: "none"
  });

  // Debug: Log if component is rendering
  console.log("TurfFilters component rendering:", { turfData, onFiltersChange });

  // Calculate price range from data
  const priceRange = turfData ? {
    min: Math.min(...turfData.map(t => t.pricePerHour)),
    max: Math.max(...turfData.map(t => t.pricePerHour))
  } : { min: 0, max: 10000 };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceChange = (type, value) => {
    const newFilters = {
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: parseInt(value)
      }
    };
    handleFilterChange(newFilters);
  };

  const handleRatingChange = (rating) => {
    const newFilters = {
      ...filters,
      rating: rating
    };
    handleFilterChange(newFilters);
  };

  const handleSortChange = (sortBy) => {
    const newFilters = {
      ...filters,
      sortBy
    };
    handleFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      priceRange: { min: priceRange.min, max: priceRange.max },
      rating: 0,
      sortBy: "none"
    };
    setFilters(clearedFilters);
    handleFilterChange(clearedFilters);
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.priceRange.min > priceRange.min || filters.priceRange.max < priceRange.max) count++;
    if (filters.rating > 0) count++;
    if (filters.sortBy !== "none") count++;
    return count;
  };

  return (
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline btn-primary flex items-center gap-2"
      >
        <Filter size={20} />
        Filters
        {getFilterCount() > 0 && (
          <span className="badge badge-secondary">{getFilterCount()}</span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="card bg-base-100 shadow-xl mt-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filter Turfs</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-sm"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range Filter */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <DollarSign size={18} className="text-primary" />
                Price Range (₹/hour)
              </h4>
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <span className="text-sm">Min:</span>
                  <input
                    type="number"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="input input-bordered input-sm w-20"
                    min={priceRange.min}
                    max={priceRange.max}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-sm">Max:</span>
                  <input
                    type="number"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="input input-bordered input-sm w-20"
                    min={priceRange.min}
                    max={priceRange.max}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Range: ₹{priceRange.min} - ₹{priceRange.max}
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Star size={18} className="text-primary" />
                Minimum Rating
              </h4>
              <div className="space-y-2">
                {[0, 1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={() => handleRatingChange(rating)}
                      className="radio radio-primary radio-sm"
                    />
                    <div className="flex items-center gap-1">
                      {rating === 0 ? (
                        <span className="text-sm">Any Rating</span>
                      ) : (
                        <>
                          <span className="text-sm">{rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={`${
                                  i < rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm">& up</span>
                        </>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-3">
              <h4 className="font-medium">Sort By</h4>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="none">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating-high">Rating: High to Low</option>
                <option value="rating-low">Rating: Low to High</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <button
              onClick={clearFilters}
              className="btn btn-ghost btn-sm"
            >
              Clear All Filters
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-primary btn-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurfFilters;
