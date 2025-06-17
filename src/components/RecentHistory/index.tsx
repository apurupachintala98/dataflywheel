import {
  ChatContainer,
  ChatDateTime,
  ChatHeading,
  ChatItem,
  ChatLeftItem,
  ChatRightItem,
  ChatTitle,
} from "./styled.components";
import { IconButton, List } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { cropString } from "utils/common";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import Cloud from "@mui/icons-material/Cloud";
import React from "react";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { RecentHistoryProps } from "interface";

const ITEM_HEIGHT = 48;

function RecentHistory({ title, isDotVisible, list }: RecentHistoryProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <List>
      <ChatContainer>
        <ChatHeading>{title}</ChatHeading>
        {list.map((listItem: { title: string; isActive: boolean; onTitleClick: any }, index) => (
          <ChatItem
            key={index}
            className={listItem.isActive ? "active" : "notActive"}
            onClick={() => {
              listItem.onTitleClick(listItem.title);
            }}
          >
            <ChatLeftItem>
              <ChatTitle className={listItem.isActive ? "active" : "notActive"}>
                {cropString(listItem.title)}
              </ChatTitle>
            </ChatLeftItem>
            {isDotVisible && (
              <>
                <ChatRightItem>
                  {/* <MoreVertIcon /> */}
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? "long-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVertIcon fill="#fff" />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                      paper: {
                        style: {
                          maxHeight: ITEM_HEIGHT * 4.5,
                          width: "20ch",
                        },
                      },
                      list: {
                        "aria-labelledby": "long-button",
                      },
                    }}
                  >
                    <MenuList>
                      <MenuItem>
                        <ListItemIcon>
                          <PushPinOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Pin</ListItemText>
                      </MenuItem>
                      <MenuItem>
                        <ListItemIcon>
                          <CreateOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Rename</ListItemText>
                      </MenuItem>
                      <MenuItem>
                        <ListItemIcon>
                          <DeleteOutlineOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </ChatRightItem>
              </>
            )}
          </ChatItem>
        ))}
      </ChatContainer>
    </List>
  );
}
export default RecentHistory;
