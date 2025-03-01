import { PublicClientApplication, Configuration, LogLevel, AccountInfo } from "@azure/msal-browser";

// Development mock account
const devAccount: AccountInfo = {
  homeAccountId: "dev-account",
  localAccountId: "dev-local",
  environment: "dev",
  tenantId: "dev-tenant",
  username: "dev@example.com",
  name: "Development User",
};

const isDevelopment = process.env.NODE_ENV === "development";

const msalConfig: Configuration = isDevelopment ? {
  auth: {
    clientId: 'dev-client-id',
    authority: 'https://dev.authority.com',
    redirectUri: 'http://localhost:3002',
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  }
} : {
  auth: {
    clientId: process.env.REACT_APP_AUTH_CLIENT_ID || '', // Replace with your Azure AD app client ID
    authority: process.env.REACT_APP_AUTH_TENANT_ID,
    redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URL, // Replace with your redirect URI
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      }
    }
  }
};

export const loginRequest = {
  scopes: ["User.Read"]
};

// Initialize MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Handle initial account setup
if (isDevelopment) {
  // In development, set the mock account
  msalInstance.setActiveAccount(devAccount);
} else {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }
}

export default msalInstance;
