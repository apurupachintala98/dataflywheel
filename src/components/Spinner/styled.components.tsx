import styled from "styled-components";

export const Container = styled.div<{ zIndex?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0, 0.4);
  ${(p) => p.zIndex && `z-index: ${p.zIndex}`};
`;

export const StyledSpinner = styled.img`
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;
