import { useContext } from "react";
// import { AuthContext } from "../context/AuthProvider";
import { Navigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, userRole, loading } = useContext(AuthContext);

if (loading || userRole === null) return <p>Loading...</p>;

  if (!user || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
