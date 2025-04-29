// styled.components.tsx
import styled from "styled-components";
import { Button, TextInput } from "@carbon/react";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
  position: relative;
  transition: all 0.5s ease-in-out;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

export const SideToggleButton = styled.div`
  position: absolute;
  top: 5px;
  left: -6px;
  background: transparent;
  z-index: 10;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

export const MenuLabel = styled.div<{ active: boolean }>`
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #5d5d5d;
  background-color: ${({ active }) => (active ? "#f1f1f1" : "transparent")};
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s ease-in-out;
`;

export const MessageScrollContainer = styled.div`
  padding-top: 80px;
  padding-bottom: 140px;
  flex-grow: 1;
  margin: 50px auto 0;
  width: 100%;
  max-width: 45%;
  overflow-y: scroll;
  scroll-behavior: smooth;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const MessageContainer = styled.div<{ fromUser: boolean }>`
  display: flex;
  justify-content: ${({ fromUser }) => (fromUser ? "flex-end" : "flex-start")};
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
`;

export const UserMessage = styled.div`
  padding: 10px;
  background-color: hsla(0, 0%, 91%, 0.5);
  color: black;
  border-radius: 10px;
  max-width: 75%;
`;

export const InputWrapper = styled.div<{ submitted: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 12px 20px;
  border-radius: 20px;
  border: 1px solid #e3e3e3;
  box-shadow: 0 0 0 0 #0000, 0 0 0 0 #0000, 0 9px 9px 0px rgba(0, 0, 0, 0.01), 0 2px 5px 0px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 45%;
  position: absolute;
  bottom: ${({ submitted }) => (submitted ? "20px" : "50%")};
  transform: ${({ submitted }) => (submitted ? "translateY(0)" : "translateY(50%)")};
  transition: all 0.5s ease-in-out;
`;

export const InputBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
`;

export const StyledTextInput = styled(TextInput)`
  flex-grow: 1;
  margin: 0 10px;
`;

export const UploadArea = styled.div`
  margin-right: 10px;
  position: relative;
  height: 48px;
  width: 48px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  background: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const UploadCloseButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: black;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const UploadPopup = styled.div`
  position: absolute;
  top: -50px;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  z-index: 1300;
`;

export const ButtonSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 12px;
`;

export const LeftButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const CenteredMessage = styled.div`
  font-weight: 600;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
  position: absolute;
  bottom: 57%;
`;

export const UploadButton = styled(Button)`
  border-radius: 50px;
  text-transform: none;
  font-size: 13.3px;
  padding: 6px 12px;
  color: #5d5d5d;
  border-color: #5d5d5d;
`;

export const SendButton = styled(Button)`
  background: #5d5d5d;
  border-radius: 50%;
  width: 40px;
  height: 40px;
`;
