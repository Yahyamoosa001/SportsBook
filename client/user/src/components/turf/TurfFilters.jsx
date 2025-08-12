import { useState } from "react";
import { Filter, X, Star, DollarSign, MapPin, RotateCcw } from "lucide-react";

const TurfFilters = ({ onFiltersChange, onResetFilters, turfData, stats, availableStates }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 10000 },
    rating: 0,
    state: "",
    sortBy: "none"
  });

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(filters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      priceRange: { min: 0, max: 10000 },
      rating: 0,
      state: "",
      sortBy: "none"
    };
    setFilters(resetFilters);
    onResetFilters();
    setIsOpen(false);
  };

  const handlePriceChange = (type, value) => {
    handleFilterChange({
      priceRange: {
        ...filters.priceRange,
        [type]: value === "" ? (type === "min" ? 0 : 10000) : Number(value)
      }
    });
  };

  return (
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-outline btn-primary flex items-center gap-2"
        >
          <Filter size={20} />
          Filters
          {stats && stats.filtered !== stats.total && (
            <span className="badge badge-secondary">{stats.filtered}</span>
          )}
        </button>
        
        {stats && (
          <div className="text-sm text-gray-600">
            Showing {stats.filtered} of {stats.total} facilities
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="bg-base-200 p-6 rounded-lg shadow-lg border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter size={20} />
              Filter Facilities
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium flex items-center gap-2">
                <DollarSign size={16} />
                Price Range (₹/hour)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="input input-bordered input-sm w-full"
                  value={filters.priceRange.min || ""}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="input input-bordered input-sm w-full"
                  value={filters.priceRange.max === 10000 ? "" : filters.priceRange.max}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                />
              </div>
              <div className="text-xs text-gray-500">
                ₹{filters.priceRange.min} - ₹{filters.priceRange.max === 10000 ? "∞" : filters.priceRange.max}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium flex items-center gap-2">
                <Star size={16} />
                Minimum Rating
              </label>
              <select
                className="select select-bordered select-sm w-full"
                value={filters.rating}
                onChange={(e) => handleFilterChange({ rating: Number(e.target.value) })}
              >
                <option value={0}>Any Rating</option>
                <option value={1}>1 Star & up</option>
                <option value={2}>2 Stars & up</option>
                <option value={3}>3 Stars & up</option>
                <option value={4}>4 Stars & up</option>
                <option value={5}>5 Stars only</option>
              </select>
            </div>

            {/* State Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium flex items-center gap-2">
                <MapPin size={16} />
                State/Location
              </label>
              <select
                className="select select-bordered select-sm w-full"
                value={filters.state}
                onChange={(e) => handleFilterChange({ state: e.target.value })}
              >
                <option value="">All States</option>
                {availableStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Sort By</label>
              <select
                className="select select-bordered select-sm w-full"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              >
                <option value="none">Default</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="ratingDesc">Rating: High to Low</option>
                <option value="ratingAsc">Rating: Low to High</option>
                <option value="nameAsc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleResetFilters}
              className="btn btn-ghost btn-sm flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="btn btn-primary btn-sm"
            >
              Apply Filters
            </button>
          </div>

          {/* Filter Summary */}
          {(filters.priceRange.min > 0 || filters.priceRange.max < 10000 || filters.rating > 0 || filters.state) && (
            <div className="mt-4 p-3 bg-base-300 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Active Filters:</h4>
              <div className="flex flex-wrap gap-2 text-sm">
                {filters.priceRange.min > 0 && (
                  <span className="badge badge-outline">Min Price: ₹{filters.priceRange.min}</span>
                )}
                {filters.priceRange.max < 10000 && (
                  <span className="badge badge-outline">Max Price: ₹{filters.priceRange.max}</span>
                )}
                {filters.rating > 0 && (
                  <span className="badge badge-outline">{filters.rating}+ Stars</span>
                )}
                {filters.state && (
                  <span className="badge badge-outline">State: {filters.state}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TurfFilters;
