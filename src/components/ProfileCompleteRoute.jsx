import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProfileCompleteRoute = ({ children }) => {
  const { accessToken, accesstoken, token, isProfileSetup } = useSelector((state) => state.auth);
  const tokenExists = Boolean(accessToken || accesstoken || token);

  if (!tokenExists) return <Navigate to="/login" replace />;
  if (!isProfileSetup) return <Navigate to="/profile/setup" replace />;

  return children;
};

export default ProfileCompleteRoute;
