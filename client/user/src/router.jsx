import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "./layouts/Root";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Turf from "./components/turf/Turf";
import TurfDetails from "./components/turf/TurfDetails";
import BecomeOwner from "./features/becomeOwner/BecomeOwner";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Reservation from "./components/Reservation";
import TurfBookingHistory from "./components/turf/TurfBookingHistory";
import { TurfRedirect, AuthTurfRedirect } from "./components/common/TurfRedirect";
import NotFound from "./components/common/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "facilities",
        element: <Turf />,
      },
      {
        path: "facility/:id",
        element: <TurfDetails />,
      },
      // Redirect old routes to new ones
      {
        path: "turfs",
        element: <Navigate to="/facilities" replace />,
      },
      {
        path: "turf/:id",
        element: <TurfRedirect />,
      },
    ],
  },
  {
    path: "/auth",
    element: <ProtectedLayout />,
    // errorElement: <div>Error</div>,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "facilities",
        element: <Turf />,
      },
      {
        path: "facility/:id",
        element: <TurfDetails />,
      },

      {
        path: "reserve/:id",
        element: <Reservation />,
      },
      {
        path: "become-owner",
        element: <BecomeOwner />,
      },
      {
        path: "booking-history",
        element: <TurfBookingHistory />,
      },
      // Redirect old authenticated routes to new ones
      {
        path: "turfs",
        element: <Navigate to="/auth/facilities" replace />,
      },
      {
        path: "turf/:id",
        element: <AuthTurfRedirect />,
      },
    ],
  },
]);

export default router;
