import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getTimeUntilExpiration } from '../utils/auth';

export const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check immediately on mount
    if (!isAuthenticated()) {
      navigate('/', { replace: true });
      return;
    }

    // Set up periodic check for token expiration (every 30 seconds)
    const checkInterval = setInterval(() => {
      if (!isAuthenticated()) {
        console.log('Token expired during session, redirecting to login');
        navigate('/', { replace: true });
      }
    }, 30000); // Check every 30 seconds

    // Also set up a timeout for when the token is about to expire
    const timeUntilExpiration = getTimeUntilExpiration(localStorage.getItem('token'));
    let expirationTimeout: ReturnType<typeof setTimeout> | null = null;

    if (timeUntilExpiration && timeUntilExpiration > 0) {
      // Set timeout to redirect 1 minute before expiration
      const timeoutDelay = Math.max(timeUntilExpiration - 60000, 1000); // At least 1 second
      expirationTimeout = setTimeout(() => {
        console.log('Token about to expire, redirecting to login');
        navigate('/', { replace: true });
      }, timeoutDelay);
    }

    // Cleanup
    return () => {
      clearInterval(checkInterval);
      if (expirationTimeout) {
        clearTimeout(expirationTimeout);
      }
    };
  }, [navigate]);
};