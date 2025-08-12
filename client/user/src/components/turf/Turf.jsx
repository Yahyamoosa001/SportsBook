import { useState, useEffect } from "react";
import TurfCard from "./TurfCard.jsx";
import TurfCardSkeleton from "../ui/TurfCardSkeleton.jsx";
import TurfFilters from "./TurfFilters.jsx";
import useTurfData from "../../hooks/useTurfData.jsx";
import useTurfFilters from "../../hooks/useTurfFilters.jsx";
import SearchTurf from "../search/SearchTurf.jsx";

const Turf = () => {
  const { turfs, loading, error } = useTurfData();
  const { filteredTurfs, updateFilters, resetFilters, stats, availableStates } = useTurfFilters(turfs);
  const [searchedTurfs, setSearchedTurfs] = useState(filteredTurfs);

  // Update searched turfs when filtered turfs change
  useEffect(() => {
    setSearchedTurfs(filteredTurfs);
  }, [filteredTurfs]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") {
      setSearchedTurfs(filteredTurfs);
      return;
    }

    const searched = filteredTurfs.filter(
      (turf) =>
        turf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turf.sportTypes.some((sport) =>
          sport.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        turf.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (turf.state && turf.state.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setSearchedTurfs(searched);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Discover Facilities</h1>
      
      <SearchTurf onSearch={handleSearch} />
      
      <TurfFilters 
        onFiltersChange={updateFilters}
        onResetFilters={resetFilters}
        turfData={turfs}
        stats={stats}
        availableStates={availableStates}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <TurfCardSkeleton key={`skeleton-${index}`} />
            ))
          : searchedTurfs.length > 0 
            ? searchedTurfs.map((turf) => (
                <TurfCard key={turf._id} turf={turf} />
              ))
            : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500 text-lg">
                    {turfs && turfs.length > 0 
                      ? "No facilities match your current filters. Try adjusting your search criteria." 
                      : "No facilities available at the moment."}
                  </div>
                  {turfs && turfs.length > 0 && (
                    <button 
                      onClick={resetFilters}
                      className="btn btn-outline btn-primary mt-4"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
      </div>
    </div>
  );
};

export default Turf;
