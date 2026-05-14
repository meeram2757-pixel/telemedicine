import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProfileRoute = ({ children }) => {
  const { accessToken, accesstoken, token, isProfileSetup } = useSelector((state) => state.auth);
  const tokenExists = Boolean(accessToken || accesstoken || token);

  if (!tokenExists) return <Navigate to="/login" replace />;
  if (isProfileSetup) return <Navigate to="/patient/dashboard" replace />;

  return children;
};

export default ProfileRoute;
