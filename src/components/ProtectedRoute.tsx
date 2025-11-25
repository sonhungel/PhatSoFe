import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication on component mount
    if (!isAuthenticated()) {
      navigate('/', { replace: true });
      return;
    }

    // Set up periodic check for token expiration (every 30 seconds)
    const checkInterval = setInterval(() => {
      if (!isAuthenticated()) {
        console.log('Token expired, redirecting to login');
        navigate('/', { replace: true });
      }
    }, 30000); // Check every 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(checkInterval);
  }, [navigate]);

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;