import { PublicClientApplication, Configuration } from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: "49a83fac-c201-4d5b-ac4d-21806a466a16", // Replace with your Azure AD app client ID
    authority: "https://login.microsoftonline.com/common", // Replace with your Azure AD tenant ID
    redirectUri: "http://localhost:3000", // Replace with your redirect URI
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
