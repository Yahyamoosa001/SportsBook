import { Link } from "react-router-dom";

import useTurfData from "../hooks/useTurfData";
import TurfCard from "../components/turf/TurfCard";
import TurfCardSkeleton from "../components/ui/TurfCardSkeleton";
import { useSelector } from "react-redux";

 
const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { turfs, loading } = useTurfData();



  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="hero min-h-[70vh] bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse animate-slide-in-right">
          <div className="w-full lg:w-1/2">
            <img
              src="/sports-facility.jpg"
              alt="NORD Architects Multi Sports Complex"
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
          <div className="w-full lg:w-1/2 animate-zoom-in">
            <h1 className="text-5xl font-bold ">Welcome to Sportbook</h1>
            <p className="py-6">
              Discover and book the best turf fields in your area. Whether
              you&#39;re planning a casual game or a tournament, Sportbook has
              got you covered.
            </p>
            <Link
              to={isLoggedIn ? "/auth/facilities" : "/signup"}
              className="btn btn-accent"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto  p-4 animate-slide-in-left">
        <h2 className="text-3xl font-bold mb-6">Featured Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <TurfCardSkeleton key={`skeleton-${index}`} />
              ))
            : turfs
                .slice(0, 3)
                .map((turf) => <TurfCard key={turf._id} turf={turf} />)}
        </div>
        <div className="text-center mt-8">
          <Link
            to={isLoggedIn ? "/auth/facilities" : "/facilities"}
            className="btn btn-primary"
          >
            View More Facilities
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
