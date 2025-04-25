import { useTranslation } from "react-i18next";

import {
  AuthContainer,
  AvatarImage,
  Container,
  Logo,
  LogoContainer,
  LogoutContainer,
  RightHeaderContainer,
  SearchField,
  TagLine,
} from "./styled.components";

import { checkValidUserInfo } from "utils/common/index";
import { useLogout } from "utils/hooks";

import avatar from "assests/images/avatar.svg";
import LogoImg from "assests/images/Logo.svg";
import { useAuth } from "contexts/AuthContext";
import { HeaderProps, TypeProps } from "interface";

function Header({
  zIndex,
  type = TypeProps.Auto,
  isSearchEnabled = false,
  sidebarType = "full",
}: HeaderProps) {
  const { t } = useTranslation();
  const { isAuthenticated, userInfo } = useAuth();
  const { handleLogout } = useLogout();

  return (
    <Container zIndex={zIndex} type={type}>
      <div>
        {sidebarType === "mini" && (
          <LogoContainer>
            <Logo src={LogoImg} alt="logo" />
            <TagLine>Elevance Data Intelligence Platform Dashboard </TagLine>
          </LogoContainer>
        )}
      </div>
      {(isSearchEnabled || isAuthenticated) && (
        <RightHeaderContainer>
          {/* {isSearchEnabled && (
            <SearchField
              labelText={t("header.searchPlaceholder")}
              placeholder={t("header.searchPlaceholder")}
            />
          )} */}
          {isAuthenticated && checkValidUserInfo(userInfo) && (
            <AuthContainer>
              {t("header.welcomeText")} {userInfo.user.username}!
              <AvatarImage src={avatar} width={25} height={25} />
              <LogoutContainer onClick={handleLogout}>{t("header.logoutText")}</LogoutContainer>
            </AuthContainer>
          )}
        </RightHeaderContainer>
      )}
    </Container>
  );
}
export default Header;
