// envStore.ts
let currentAppId = "POCGENAI";

export const setCurrentAppId = (appId: string) => {
  currentAppId = appId;
};

export const getCurrentAppId = () => currentAppId;
