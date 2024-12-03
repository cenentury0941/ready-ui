import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../authConfig'; // Import the login request from your config

function useTokenValidation() {
  const { instance, inProgress } = useMsal();
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      // Ignore if MSAL is in the middle of an interaction
      if (inProgress !== InteractionStatus.None) return;

      const accounts = instance.getAllAccounts();

      // if (accounts.length === 0) {
      //   performFullLogout();
      //   return;
      // }

      try {
        const request = {
          ...loginRequest, // Use the predefined login request
          account: accounts[0]
        };

        // Attempt to silently acquire token
        await instance.acquireTokenSilent(request);
        setIsTokenValid(true);
      } catch (error) {
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, [instance, inProgress, navigate]);

  return isTokenValid;
}

export { useTokenValidation };
