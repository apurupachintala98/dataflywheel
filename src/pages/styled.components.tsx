import styled from "styled-components";

export const MainContainer = styled.div<{ height: number }>`
  margin: 0;
  padding: 0;
  overflow-y: auto;
  ${(p) => p.height && `height: ${p.height}px`};
  background-color: ${(props) => props.theme.color.background};
`;

export const PageContainer = styled.div`
  padding: ${(props) => props.theme.space["20"]};
`;

export const HeaderContainer = styled.div`
  display: ${(props) => props.theme.display["flex"]};
  align-items: ${(props) => props.theme.alignItems["center"]};
  justify-content: ${(props) => props.theme.alignContent["space-between"]};
  margin-bottom: ${(props) => props.theme.space["16"]};
`;

export const PageTitle = styled.h2`
  font-family: ${(props) => props.theme.fontFamily["IBM Plex Sans"]},
    ${(props) => props.theme.fontFamily["sans-serif"]};
  font-weight: ${(props) => props.theme.fontWeight.normal};
  font-size: ${(props) => props.theme.fontSize["32"]};
  line-height: ${(props) => props.theme.lineHeight.lg};
  letter-spacing: ${(props) => props.theme.letterSpacing["0"]};
  color: ${(props) => props.theme.color.black};
`;

export const PageSection = styled.div`
  background-color: ${(props) => props.theme.color.white};
  border: 1px solid ${(props) => props.theme.color.pageSectionBorder};
  box-shadow: 0px 4px 4px 0px ${(props) => props.theme.color.pageSectionShadow};
  padding: ${(props) => props.theme.space["5"]};
  margin-top: ${(props) => props.theme.space["16"]};
  .tableHeader,
  .tableHeader th {
    background-color: ${(props) => props.theme.color.pageSectionBackground};
    color: ${(props) => props.theme.color.white};
  }
`;

export const PageSectionHeading = styled.div`
  // background-color: ${(props) => props.theme.color.pageSeactionHeader};
  color: ${(props) => props.theme.color.text};
  padding: ${(props) => props.theme.space["16"]} ${(props) => props.theme.space["16"]}
    ${(props) => props.theme.space["24"]} ${(props) => props.theme.space["16"]};
`;

export const TagLine = styled.span`
  font-size: ${(props) => props.theme.fontSize.md};
  line-height: ${(props) => props.theme.lineHeight["22"]};
  padding: 0 10px;
  margin-left: 10px;
  display: flex;
  align-items: end;
  border-left: 1px solid #d2d2d2;
  color: #002d9c;
  font-weight: ${(props) => props.theme.fontWeight["medium"]};
`;

export const ToggleContainer = styled.div`
  background: #fff;
  border: 1px solid transparent;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -20px;
  top: 50px;
  cursor: pointer;
  border-image-source: linear-gradient(90deg, #FFFFFF 51.25%, #B2B2B2 52.5%);
  border-image-slice: 1; 
  border-image-repeat: stretch;
`;

export const InputSearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
export const Input = styled.input`
  border: 1px solid #dfdada;
  padding: 10px;
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 5px;
  padding-left: 30px;
  &:focus {
    outline: none;
  }
`;

export const SideBarContainer = styled.div`
  padding: 5px 16px;
  overflow-y: auto;
`;

export const Button = styled.button`
  color: #000000;
  background-color: transparent;
  padding: 8px 0px;
  border: 0 none;
  display: flex;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
  img {
    margin-right: 5px;
  }
`;

export const NotificationFooter = styled.div`
  padding: 0 ${(props) => props.theme.space["16"]};
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin-top: auto;
  font-size: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  margin-bottom: 15px;
  svg {
    width: 18px;
    margin-right: 5px;
  }
  li {
    cursor: pointer;
    padding: 5px 0;
  }
`;

export const ChatContainer = styled.div``;
export const ChatHeading = styled.div`
  font-size: 16px;
  line-height: 18px;
  margin-bottom: 10px;
`;
export const ChatItem = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  padding: 10px 5px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  &.active {
    border-left: 5px solid #2761bb;
  }
  &.notActive {
    border-left: 5px solid #c6c6c6;
    color: #6f6f6f;
  }
  min-height: 65px;
  align-items: center;
`;
export const ChatLeftItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
export const ChatRightItem = styled.div`
  cursor: pointer;
`;

export const ChatTitle = styled.h2`
  font-size: 14px;
  line-height: 18px;
  &.active {
    font-weight: bold;
  }
`;

export const ChatDateTime = styled.div`
  font-size: 12px;
  line-height: 18px;
`;
