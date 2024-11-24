import { Navigate } from "react-router-dom";
import Index from "./Index";
import WelcomePage from "./WelcomePage";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <WelcomePage /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
