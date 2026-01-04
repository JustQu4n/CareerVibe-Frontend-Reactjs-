import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole = "employer" }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user exists and has required role
    const hasRole = user && (
      user.roles?.includes(requiredRole) || 
      user.role === requiredRole
    );
    
    if (!hasRole) {
      console.log(`ProtectedRoute: Access denied, redirecting to home. Required: ${requiredRole}, User roles:`, user?.roles);
      navigate("/");  
    }
  }, [user, navigate, requiredRole]);   
 
  // Check if user exists and has required role
  const hasRole = user && (
    user.roles?.includes(requiredRole) || 
    user.role === requiredRole
  );
  
  if (!hasRole) {
    return null;   
  }

  return <>{children}</>;   
};

export default ProtectedRoute;
