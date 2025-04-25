import React, { createContext, useContext, useState } from "react";

import { checkValidUserInfo } from "utils/common";

import { AuthContextType, AuthProviderProps, UserInfo } from "interface";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const initalUserInfo = {
    exp: 0,
    user: {
      username: "",
    },
  };
  const [userInfo, setUserInfo] = useState<UserInfo>(initalUserInfo);

  const login = (userInfo: UserInfo) => {
    setUserInfo(userInfo);
  };

  const logout = () => {
    setUserInfo(initalUserInfo);
  };

  const isAuthenticated = checkValidUserInfo(userInfo);

  console.log("isAuthenticated AUTH::", userInfo);

  return (
    <AuthContext.Provider value={{ userInfo, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
