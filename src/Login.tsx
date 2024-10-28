import React from 'react';
import { useMsal } from "@azure/msal-react";
import MicrosoftIcon from './assets/Microsoft Sign-in Branding.png';

const Login: React.FC = () => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      await instance.loginRedirect();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="App-title">ReadY</h1>
      <p className="App-tagline">Your gateway to endless reading adventures</p>
      <button className="login-button" onClick={handleLogin}>
        <img src={MicrosoftIcon} alt="Microsoft 365" className="microsoft-icon" />
        Login with Microsoft
      </button>
    </div>
  );
};

export default Login;
