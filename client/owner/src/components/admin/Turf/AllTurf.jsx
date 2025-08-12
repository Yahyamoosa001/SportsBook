import { PackageOpen } from "lucide-react";
import useTurfData from "@hooks/admin/useTurf";
import useTurfFilters from "@hooks/admin/useTurfFilters";
import Turf from "./Turf";
import TurfSkeleton from "./TurfSkeleton";
import TurfFilters from "./TurfFilters";

export const AllTurf = () => {
  const { turfData, loading } = useTurfData();
  const { filteredTurfs, updateFilters, stats } = useTurfFilters(turfData);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-12 w-32"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, index) => (
            <TurfSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!turfData || turfData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-base-200 rounded-lg">
        <PackageOpen size={64} className="text-gray-400 mb-4" />
                  <p className="text-xl font-semibold text-gray-600">
            No facilities available
          </p>
          <p className="text-gray-500 mt-2">Check back later for new facilities!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Facilities</h1>
        {stats && (
          <div className="text-sm text-gray-600">
            Showing {stats.filtered} of {stats.total} facilities
          </div>
        )}
      </div>
      
      <TurfFilters 
        onFiltersChange={updateFilters}
        turfData={turfData}
      />

      {filteredTurfs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-base-200 rounded-lg">
          <PackageOpen size={64} className="text-gray-400 mb-4" />
          <p className="text-xl font-semibold text-gray-600">
            No facilities match your filters
          </p>
          <p className="text-gray-500 mt-2">Try adjusting your filter criteria!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTurfs.map((turf) => (
            <Turf key={turf._id} turf={turf} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTurf;
