import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const tokenExists = useSelector((state) => Boolean(state.auth.accessToken || state.auth.accesstoken || state.auth.token));

  if (tokenExists) return <Navigate to="/patient/dashboard" replace />;

  return children;
};

export default PublicRoute;
