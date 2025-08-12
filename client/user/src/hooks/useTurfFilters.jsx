import { useState, useEffect, useMemo } from "react";

const useTurfFilters = (turfs) => {
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 10000 },
    rating: 0,
    state: "",
    sortBy: "none",
  });

  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 10000 },
      rating: 0,
      state: "",
      sortBy: "none",
    });
  };

  const filteredTurfs = useMemo(() => {
    if (!turfs) return [];

    let currentFiltered = [...turfs];

    // Apply price filter
    currentFiltered = currentFiltered.filter(
      (turf) =>
        turf.pricePerHour >= filters.priceRange.min &&
        turf.pricePerHour <= filters.priceRange.max
    );

    // Apply rating filter
    if (filters.rating > 0) {
      currentFiltered = currentFiltered.filter(
        (turf) => (turf.avgRating || 0) >= filters.rating
      );
    }

    // Apply state filter
    if (filters.state && filters.state !== "") {
      currentFiltered = currentFiltered.filter(
        (turf) => turf.state && turf.state.toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    // Apply sorting
    if (filters.sortBy === "priceAsc") {
      currentFiltered.sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (filters.sortBy === "priceDesc") {
      currentFiltered.sort((a, b) => b.pricePerHour - a.pricePerHour);
    } else if (filters.sortBy === "ratingDesc") {
      currentFiltered.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    } else if (filters.sortBy === "ratingAsc") {
      currentFiltered.sort((a, b) => (a.avgRating || 0) - (b.avgRating || 0));
    } else if (filters.sortBy === "nameAsc") {
      currentFiltered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return currentFiltered;
  }, [turfs, filters]);

  // Get unique states for filter dropdown
  const availableStates = useMemo(() => {
    if (!turfs) return [];
    const states = turfs
      .map((turf) => turf.state)
      .filter((state) => state && state.trim() !== "")
      .filter((state, index, arr) => arr.indexOf(state) === index) // unique values
      .sort();
    return states;
  }, [turfs]);

  const stats = useMemo(() => {
    return {
      filtered: filteredTurfs.length,
      total: turfs ? turfs.length : 0,
    };
  }, [filteredTurfs, turfs]);

  return { 
    filteredTurfs, 
    updateFilters, 
    resetFilters, 
    stats, 
    availableStates,
    currentFilters: filters
  };
};

export default useTurfFilters;
