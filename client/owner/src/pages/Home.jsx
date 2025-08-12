import { Link } from "react-router-dom";

import { Footer } from "@components/common";

const Home = () => {

  return (
    <div className="  bg-base-100 text-base-content">
      <div className="hero min-h-[82vh] bg-base-200 ">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="w-full lg:w-1/2">
            <img
              src="/sports-facility.jpg"
              alt="NORD Architects Multi Sports Complex"
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <h1 className="text-5xl font-bold">Welcome to Sportbook</h1>
            <p className="py-6">
              Discover and book the best sports facilities in your area. Whether
              you&#39;re planning a casual game or a tournament, Sportbook has
              got you covered.
            </p>
            <Link to="/login" className="btn btn-accent">
              Login
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
