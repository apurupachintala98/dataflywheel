import { ReactNode } from "react";

export interface SpinnerProps {
  zIndex?: string;
}

export interface ThemeProps {
  theme: string;
  children: React.ReactNode;
}

export enum TypeProps {
  Auto = "auto",
  Fixed = "fixed",
}

export interface HeaderProps {
  zIndex?: string;
  type?: TypeProps;
  isSearchEnabled?: boolean;
  sidebarType?: string;
}

export interface DataTableProps {
  title: string;
  header: string[];
  row: object[];
}

export interface UserInfo {
  exp?: number;
  user: {
    username: string;
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface AuthContextType {
  userInfo: UserInfo;
  isAuthenticated: boolean;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}
