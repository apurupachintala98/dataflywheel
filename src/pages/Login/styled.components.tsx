import styled from "styled-components";

import { size } from "utils/common";

export const AppContainer = styled.div`
  text-align: ${(props) => props.theme.textAlign["left"]};
`;

export const LoginLeftImage = styled.div<{ src?: string; height: number }>`
  width: ${(props) => props.theme.width["full"]};
  ${(p) => p.src && `background-image: url(${p.src})`};
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 85% 100%;
  ${(p) => p.height && `height: ${p.height}px`};
  background-position: left center;
`;

export const LoginLeftImageV2 = styled.img`
  height: ${(props) => props.theme.height["555"]};
  width: ${(props) => props.theme.width["600"]};
  padding-left: ${(props) => props.theme.space["110"]};
  padding-top: ${(props) => props.theme.space["107"]};
`;

export const Container = styled.div<{ height: number }>`
  display: ${(props) => props.theme.display["flex"]};
  flex-direction: ${(props) => props.theme.flexDirection["row"]};
  ${(p) => p.height && `height: ${p.height}px`};
  background-color: ${(props) => props.theme.color.background};
`;

export const LeftContainer = styled.div`
  display: ${(props) => props.theme.display["flex"]};
  flex-direction: ${(props) => props.theme.flexDirection["row"]};
  width: ${(props) => props.theme.width["half"]};
`;

export const RightContainer = styled.div`
  display: ${(props) => props.theme.display["flex"]};
  flex-direction: ${(props) => props.theme.flexDirection["column"]};
  justify-content: ${(props) => props.theme.justifyContent["center"]};
  align-items: ${(props) => props.theme.alignItems["left"]};
  padding: ${(props) => props.theme.space["64"]} ${(props) => props.theme.space["80"]}
    ${(props) => props.theme.space["64"]} ${(props) => props.theme.space["80"]};
  width: ${(props) => props.theme.width["half"]};
  position: ${(props) => props.theme.position["relative"]};
  @media (max-width: ${size.desktop}) {
    padding: ${(props) => props.theme.space["0"]} ${(props) => props.theme.space["80"]}
      ${(props) => props.theme.space["0"]} ${(props) => props.theme.space["80"]};
  }
  .Toastify {
    font-family: ${(props) => props.theme.fontFamily["ZCOOL QingKe HuangYou"]},
      ${(props) => props.theme.fontFamily["sans-serif"]};
    font-size: ${(props) => props.theme.fontSize.sm};
    line-height: ${(props) => props.theme.lineHeight.md};
  }
`;

export const DataGenie = styled.div`
  font-family: ${(props) => props.theme.fontFamily["ZCOOL QingKe HuangYou"]},
    ${(props) => props.theme.fontFamily["sans-serif"]};
  font-weight: ${(props) => props.theme.fontWeight.normal};
  font-size: ${(props) => props.theme.fontSize["30"]};
  line-height: ${(props) => props.theme.lineHeight.lg};
  letter-spacing: ${(props) => props.theme.letterSpacing["0.16"]};
  padding-bottom: ${(props) => props.theme.space["65"]};
  @media (max-width: ${size.desktop}) {
    padding-bottom: ${(props) => props.theme.space["32"]};
    font-size: ${(props) => props.theme.fontSize["28"]};
    line-height: ${(props) => props.theme.lineHeight.md};
  }
`;

export const BlueText = styled.span`
  color: ${(props) => props.theme.color.secondary};
`;

export const LoginHeading = styled.div`
  font-weight: ${(props) => props.theme.fontWeight.normal};
  font-size: ${(props) => props.theme.fontSize["32"]};
  line-height: ${(props) => props.theme.lineHeight["40"]};
  letter-spacing: ${(props) => props.theme.letterSpacing["0"]};
  padding-bottom: ${(props) => props.theme.space["14"]};
  @media (max-width: ${size.desktop}) {
    font-size: ${(props) => props.theme.fontSize["28"]};
    line-height: ${(props) => props.theme.lineHeight["34"]};
  }
`;

export const LoginSubHeading = styled.div`
  font-weight: ${(props) => props.theme.fontWeight.normal};
  font-size: ${(props) => props.theme.fontSize.sm};
  line-height: ${(props) => props.theme.lineHeight.lg};
  letter-spacing: ${(props) => props.theme.letterSpacing["0.16"]};
`;

export const LoginBottomText = styled.div`
  font-weight: ${(props) => props.theme.fontWeight.normal};
  font-size: ${(props) => props.theme.fontSize.sm};
  line-height: ${(props) => props.theme.lineHeight.lg};
  letter-spacing: ${(props) => props.theme.letterSpacing["0.16"]};
`;

export const LoginForm = styled.div`
  padding: ${(props) => props.theme.space["25"]} ${(props) => props.theme.space["0"]}
    ${(props) => props.theme.space["20"]};
  width: ${(props) => props.theme.width["400"]};
  @media (max-width: ${size.desktop}) {
    padding: ${(props) => props.theme.space["14"]} ${(props) => props.theme.space["0"]}
      ${(props) => props.theme.space["20"]};
  }
`;

export const FieldContainer = styled.div`
  padding: ${(props) => props.theme.space["0"]} ${(props) => props.theme.space["0"]}
    ${(props) => props.theme.space["25"]} ${(props) => props.theme.space["0"]};
  @media (max-width: ${size.desktop}) {
    padding: ${(props) => props.theme.space["0"]} ${(props) => props.theme.space["0"]}
      ${(props) => props.theme.space["14"]} ${(props) => props.theme.space["0"]};
  }
`;

export const ButtonContainer = styled.div`
  padding: ${(props) => props.theme.space["5"]} ${(props) => props.theme.space["0"]}
    ${(props) => props.theme.space["0"]} ${(props) => props.theme.space["0"]};
  display: ${(props) => props.theme.display["flex"]};
  column-gap: ${(props) => props.theme.space["14"]};
`;
