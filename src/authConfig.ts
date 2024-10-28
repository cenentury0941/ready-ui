import { PublicClientApplication, Configuration } from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_AUTH_CLIENT_ID || '', // Replace with your Azure AD app client ID
    authority: process.env.REACT_APP_AUTH_TENANT_ID, // Replace with your Azure AD tenant ID
    redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URL, // Replace with your redirect URI
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
