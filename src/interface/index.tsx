import { Dispatch, ReactNode, SetStateAction } from "react";

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

export interface RecentHistoryProps {
  isAddButtonEnable: boolean;
  title: string;
  isDotVisible: boolean;
  list: listProps[];
}

export interface listProps {
  id: number | string,
  title: string;
  isActive: boolean;
  onTitleClick: Dispatch<SetStateAction<string>>;
}

export interface HomeContentProps {
  isReset: boolean;
  promptValue: string;
  recentValue: string;
  isLogOut: boolean;
checkIsLogin: boolean;
  setCheckIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}
