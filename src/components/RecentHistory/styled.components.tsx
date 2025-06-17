import styled from "styled-components";

export const ChatContainer = styled.div``;
export const ChatHeading = styled.div`
  font-size: 16px;
  line-height: 18px;
  margin-bottom: 10px;
`;
export const ChatItem = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 30px;
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  &.active {
    background-color: #2761bb;
    color: #fff;
    button#long-button {
      padding: 4px;
      &:hover {
        background-color: #fff;
        svg {
          fill: #2761bb;
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
