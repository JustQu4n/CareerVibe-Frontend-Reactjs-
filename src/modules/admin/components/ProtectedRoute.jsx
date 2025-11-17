 
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user exists and has employer role (can be in roles array or role string)
    const isEmployer = user && (
      user.roles?.includes("employer") || 
      user.role === "employer"
    );
    
    if (!isEmployer) {
      console.log('ProtectedRoute: Access denied, redirecting to home');
      navigate("/");  
    }
  }, [user, navigate]);   
 
  // Check if user exists and has employer role
  const isEmployer = user && (
    user.roles?.includes("employer") || 
    user.role === "employer"
  );
  
  if (!isEmployer) {
    return null;   
  }

  return <>{children}</>;   
};

export default ProtectedRoute;
