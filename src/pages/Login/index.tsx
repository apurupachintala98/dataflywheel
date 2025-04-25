import { Button, InlineLoading, PasswordInput, TextInput } from "@carbon/react";
import { ArrowRight } from "@carbon/react/icons";
import { Fragment } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";

import {
  AppContainer,
  ButtonContainer,
  Container,
  FieldContainer,
  LeftContainer,
  LoginBottomText,
  LoginForm,
  LoginHeading,
  LoginLeftImage,
  LoginLeftImageV2,
  LoginSubHeading,
  RightContainer,
} from "./styled.components";
import Header from "components/Header";

import { useLoginForm, useWindowDimensions } from "utils/hooks";

import LoginImage from "assests/images/Login-image.jpeg";
import LoginImageV2 from "assests/images/Login-image-v2.svg";
import { TypeProps } from "interface";

function Login() {
  const { t } = useTranslation();
  const {
    loading,
    layout,
    userName,
    password,
    userNameError,
    passwordError,
    handleUserName,
    handlePassword,
    handleFormSubmit,
    handleCheckUserName,
    handleCheckPassword,
  } = useLoginForm();

  const { height } = useWindowDimensions();

  return (
    <Fragment>
      <Header zIndex="999" type={TypeProps.Fixed} sidebarType="mini" />
      <AppContainer>
        <Container height={height}>
          <LeftContainer>
            {layout === "v2" ? (
              <LoginLeftImageV2 src={LoginImageV2} />
            ) : (
              <LoginLeftImage src={LoginImage} height={height} />
            )}
          </LeftContainer>
          <RightContainer>
            <LoginHeading>{t("login.headingText")}</LoginHeading>
            <LoginSubHeading>{t("login.subHeadingText")}</LoginSubHeading>
            <LoginForm>
              <FieldContainer>
                <TextInput
                  className="input-test-class"
                  value={userName}
                  id="username"
                  labelText={t("login.usernameLabelText")}
                  size="lg"
                  invalidText={t("login.usernameError")}
                  placeholder={t("login.usernamePlaceHolderText")}
                  onChange={(e) => handleUserName(e.target.value)}
                  invalid={userNameError}
                  autoComplete="off"
                  onBlur={handleCheckUserName}
                />
              </FieldContainer>
              <FieldContainer>
                <PasswordInput
                  value={password}
                  id="password"
                  labelText={t("login.passwordLabelText")}
                  size="lg"
                  invalidText={t("login.passwordError")}
                  placeholder={t("login.passwordPlaceHolderText")}
                  onChange={(e) => handlePassword(e.target.value)}
                  invalid={passwordError}
                  autoComplete="off"
                  onBlur={handleCheckPassword}
                />
              </FieldContainer>
              <ButtonContainer>
                <Button kind="primary" size="lg" onClick={handleFormSubmit} renderIcon={ArrowRight}>
                  {t("login.loginButtonText")}
                </Button>
                {loading && <InlineLoading description={t("login.loadingText")} />}
              </ButtonContainer>
            </LoginForm>
            {/*<LoginBottomText>{t("login.bottomText")}</LoginBottomText>*/}
            <ToastContainer />
          </RightContainer>
        </Container>
      </AppContainer>
    </Fragment>
  );
}

export default Login;
