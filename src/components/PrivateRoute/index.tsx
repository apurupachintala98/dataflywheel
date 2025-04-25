import React from "react";
import { Navigate, RouteProps } from "react-router-dom";

import { useAuth } from "contexts/AuthContext";

type PrivateRouteProps = RouteProps & {
  element: React.ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/" />;
};

export default PrivateRoute;
