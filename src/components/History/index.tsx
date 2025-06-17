import {
  ChatContainer,
  ChatDateTime,
  ChatHeading,
  ChatItem,
  ChatLeftItem,
  ChatRightItem,
  ChatTitle,
} from "../../pages/styled.components";
import {
  List,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function History() {
  return (
    <List>
      <ChatContainer>
        <ChatHeading>Chat History</ChatHeading>
        <ChatItem className="active">
          <ChatLeftItem>
            <ChatTitle className="active">
             What is the FMC denominator based on in HEDIS?
            </ChatTitle>
            <ChatDateTime>01/04/2025, 14:30</ChatDateTime>
          </ChatLeftItem>
          <ChatRightItem>
            <DeleteOutlineIcon />
          </ChatRightItem>
        </ChatItem>
        <ChatItem className="notActive">
          <ChatLeftItem className="notActive">
            <ChatTitle>What is considered continuous enrollment for FMC in HEDIS?</ChatTitle>
            <ChatDateTime>01/04/2025, 14:30</ChatDateTime>
          </ChatLeftItem>
          <ChatRightItem>
            <DeleteOutlineIcon />
          </ChatRightItem>
        </ChatItem>
        <ChatItem className="notActive">
          <ChatLeftItem className="notActive">
            <ChatTitle>How should I handle direct transfers for PCR in HEDIS?</ChatTitle>
            <ChatDateTime>01/04/2025, 14:30</ChatDateTime>
          </ChatLeftItem>
          <ChatRightItem>
            <DeleteOutlineIcon />
          </ChatRightItem>
        </ChatItem>
      </ChatContainer>
    </List>
  );
}
export default History;
