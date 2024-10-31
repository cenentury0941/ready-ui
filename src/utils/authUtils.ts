import { IPublicClientApplication } from "@azure/msal-browser";

export const getUserId = (instance: IPublicClientApplication) => {
  const accounts = instance.getAllAccounts();
  if (accounts.length > 0) {
    const account = accounts[0];
    return account.homeAccountId;
  }
  return null;
};

export const getUserFullName = (instance: IPublicClientApplication) => {
  const accounts = instance.getAllAccounts();
  if (accounts.length > 0) {
    const account = accounts[0];
    return account.name;
  }
  return null;
};

export const getUserLocation = (instance: IPublicClientApplication) => {
  const accounts = instance.getAllAccounts();
  if (accounts.length > 0) {
    const account = accounts[0];
    const idTokenClaims = account.idTokenClaims as any;
    return idTokenClaims && idTokenClaims.location ? idTokenClaims.location : "Chennai";
  }
  return null;
};

export const fetchUserPhoto = async (instance: IPublicClientApplication, loginRequest: any): Promise<string | null> => {
  try {
    const accounts = instance.getAllAccounts();
    if (accounts.length === 0) return null;

    const response = await instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0]
    });

    const photoResponse = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
      headers: {
        'Authorization': `Bearer ${response.accessToken}`
      }
    });

    if (!photoResponse.ok) return null;

    const blob = await photoResponse.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching user photo:', error);
    return null;
  }
};
