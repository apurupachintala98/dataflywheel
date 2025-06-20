import {
  ChatContainer,
  ChatDateTime,
  ChatHeading,
  ChatItem,
  ChatLeftItem,
  ChatRightItem,
  ChatTitle,
} from "./styled.components";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
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
import React, { useState } from "react";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { RecentHistoryProps } from "interface";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { CssTextField } from "pages/styled.components";

const ITEM_HEIGHT = 48;
const maxLength = 45;

function RecentHistory({ isAddButtonEnable, title, isDotVisible, list }: RecentHistoryProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openAddNewDialog, setOpenAddNewDialog] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "hsla(0, 0%, 91%, 1)",
      color: "rgba(0, 0, 0, 0.87)",
      fontSize: 15,
      border: "1px solid #dadde9",
    },
  }));

  return (
    <>
      <List>
        <ChatContainer>
          <ChatHeading>
            {title}{" "}
            {isAddButtonEnable && (
              <LightTooltip title={"Add New Prompt"} placement="top-start">
                <AddCircleOutlineOutlinedIcon
                  onClick={() => setOpenAddNewDialog(true)}
                  sx={{ fontSize: 25, cursor: "pointer" }}
                />
              </LightTooltip>
            )}
          </ChatHeading>
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
                  {/* {cropString(listItem.title)} */}
                  {listItem.title.length > maxLength ? (
                    <>
                      {listItem.title.substring(0, maxLength)}
                      <LightTooltip title={listItem.title} placement="right-end">
                        <IconButton className="iconBtn" size="small" sx={{ ml: 1 }}>...</IconButton>
                      </LightTooltip>
                    </>
                  ) : (
                    <>{listItem.title}</>
                  )}
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

      <Dialog open={openAddNewDialog} onClose={() => setOpenAddNewDialog(false)}>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "left",
              alignItems: "baseline",
              gap: 1,
              padding: "0px",
              minWidth: "400px",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.5rem" }}>
              Add New Prompt
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 3, pb: 3 }}>
          <CssTextField
            label="Prompt Title *"
            fullWidth
            margin="normal"
            value={""}
            onChange={(e) => e.target.value}
          />
          {/*error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )*/}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            sx={{
              px: 2,
              py: 1,
              color: "#fff",
              borderColor: "#000",
              borderRadius: "30px",
              textTransform: "none",
              backgroundColor: "#373535",
              "&:hover": {
                backgroundColor: "#131313",
              },
            }}
            onClick={() => {}}
          >
            Add
            {/* {validating ? "Adding..." : "Add"} */}
          </Button>
          <Button
            variant="outlined"
            sx={{
              px: 2,
              py: 1,
              color: "#000",
              borderColor: "#000",
              borderRadius: "30px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#f3f3f3",
              },
            }}
            onClick={() => setOpenAddNewDialog(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default RecentHistory;
