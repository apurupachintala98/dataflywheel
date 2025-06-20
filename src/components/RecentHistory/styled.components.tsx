import styled from "styled-components";

export const ChatContainer = styled.div``;
export const ChatHeading = styled.div`
  font-size: 18px;
  line-height: 36px;
  margin-bottom: 10px;
  color: #131313;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const ChatItem = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 30px;
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  cursor: pointer;
  button.iconBtn {
    margin: 0;
    padding: 0;
    &:hover, &:active, &:focus {
      background-color: transparent;
    }
  }
  &.active {
    background-color: #131313ba;
    color: #fff;
    cursor: auto;
    button.iconBtn {
      color: #fff;
    }
    button#long-button {
      padding: 4px;
      &:hover {
        background-color: #fff;
        svg {
          fill: #131313ba;
        }
      }
      svg {
        fill: #fff;
      }
    }
  }
  &.notActive {
    color: #6f6f6f;
    button#long-button {
      padding: 4px;
    }
    &:hover {
      background-color: #f3f3f3;
    }
  }
  height: 45px;
  align-items: center;
`;
export const ChatLeftItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
export const ChatRightItem = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
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
