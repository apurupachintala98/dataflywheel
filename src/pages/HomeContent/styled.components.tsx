import styled from "styled-components";

export const AppContainer = styled.div`
  text-align: left;
  padding: 0 20px;
`;

export const ButtonContainer = styled.div`
  display: ${(props) => props.theme.display["flex"]};
  column-gap: ${(props) => props.theme.space["10"]};
`;

export const TopSection = styled.div`
  display: ${(props) => props.theme.display["flex"]};
  column-gap: ${(props) => props.theme.space["10"]};
`;

export const LeftSection = styled.div`
  width: 70%;
`;

export const RightSection = styled.div`
  width: 30%;
`;

export const ChartImage = styled.div<{ src?: string; height: number }>`
  width: ${(props) => props.theme.width["full"]};
  ${(p) => p.src && `background-image: url(${p.src})`};
  background-repeat: no-repeat;
  background-size: contain;
  ${(p) => p.height && `height: ${p.height}px`};
  background-position: center center;
  background-color: ${(props) => props.theme.color.white};
`;
