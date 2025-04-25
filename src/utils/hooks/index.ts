import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";

import ApiService from "services";

import { useAuth } from "contexts/AuthContext";

export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return { handleLogout };
}

export function useLoginForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userNameError, setUserNameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleUserName = (username: string) => {
    setUserName(username);
    setUserNameError(false);
  };

  const handlePassword = (password: string) => {
    setPassword(password);
    setPasswordError(false);
  };

  const handleCheckUserName = () => {
    if (!userName) {
      setUserNameError(true);
    }
  };

  const handleCheckPassword = () => {
    if (!password) {
      setPasswordError(true);
    }
  };

  const handleFormSubmit = async () => {
    if (userName && password) {
      setLoading(true);
      try {
        if (userName === "admin" && password === "admin1234") {
          login({ user: { username: userName } });
          navigate("/home"); // Navigate to the home page
        } else {
          toast.error(t("login.errorMessage"), {
            transition: Slide,
            theme: "light",
          });
        }
      } catch (error) {
        toast.error(t("login.errorMessage"), {
          transition: Slide,
          theme: "light",
        });
      }
      setLoading(false);
    } else {
      handleCheckUserName();
      handleCheckPassword();
    }
  };

  const layout = "v1";

  return {
    loading,
    layout,
    userName,
    password,
    userNameError,
    passwordError,
    handleUserName,
    handlePassword,
    handleCheckUserName,
    handleCheckPassword,
    handleFormSubmit,
  };
}

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};
