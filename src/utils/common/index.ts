import { UserInfo } from "interface";

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const checkValidUserInfo = (obj: UserInfo) =>
  Object.keys(obj).length > 0 && obj.user.username !== "";

export function validateEmail(email: string) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+?$/;
  return emailPattern.test(email);
}

export function cropString(str: string) {
  const maxLength = 37;
  if (str.length > maxLength) {
    return `${str.substring(0, maxLength)} ...`;
  } else {
    return str;
  }
}

export const size = {
  mobile: "320px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1280px",
  mediumDesktop: "1920px",
  largeDesktop: "2560px",
};
