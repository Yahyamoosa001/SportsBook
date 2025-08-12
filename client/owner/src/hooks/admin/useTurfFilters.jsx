import { useState, useMemo } from "react";

const useTurfFilters = (turfData) => {
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 10000 },
    rating: 0,
    sortBy: "none"
  });

  const filteredAndSortedTurfs = useMemo(() => {
    if (!turfData || turfData.length === 0) return [];

    // Apply filters
    let filtered = turfData.filter((turf) => {
      // Price filter
      const priceMatch = 
        turf.pricePerHour >= filters.priceRange.min && 
        turf.pricePerHour <= filters.priceRange.max;

      // Rating filter
      const ratingMatch = filters.rating === 0 || turf.avgRating >= filters.rating;

      return priceMatch && ratingMatch;
    });

    // Apply sorting
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case "price-high":
        filtered.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case "rating-high":
        filtered.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case "rating-low":
        filtered.sort((a, b) => a.avgRating - b.avgRating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [turfData, filters]);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const getFilterStats = () => {
    if (!turfData || turfData.length === 0) return null;

    return {
      total: turfData.length,
      filtered: filteredAndSortedTurfs.length,
      priceRange: {
        min: Math.min(...turfData.map(t => t.pricePerHour)),
        max: Math.max(...turfData.map(t => t.pricePerHour))
      },
      avgRating: turfData.reduce((sum, turf) => sum + turf.avgRating, 0) / turfData.length
    };
  };

  return {
    filteredTurfs: filteredAndSortedTurfs,
    filters,
    updateFilters,
    stats: getFilterStats()
  };
};

export default useTurfFilters;
