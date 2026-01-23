import { useAuth } from "./AuthContext";
import NoAccess from "../components/NoAccess";

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <NoAccess />;
  }

  return children;
};

export default RoleRoute;

