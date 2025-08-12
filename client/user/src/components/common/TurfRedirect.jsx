import { Navigate, useParams } from "react-router-dom";

// Component to redirect old turf routes to new facility routes
export const TurfRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/facility/${id}`} replace />;
};

export const AuthTurfRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/auth/facility/${id}`} replace />;
};

export default TurfRedirect;
