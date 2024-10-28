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
