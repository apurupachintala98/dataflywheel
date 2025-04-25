import { TextInput } from "@carbon/react";
import {
  Analytics,
  Dashboard as DashboardIcon,
  IbmCloudProjects,
  SidePanelClose,
  SidePanelOpenFilled,
} from "@carbon/react/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  Button,
  ChatContainer,
  ChatDateTime,
  ChatHeading,
  ChatItem,
  ChatLeftItem,
  ChatRightItem,
  ChatTitle,
  Input,
  InputSearchContainer,
  NotificationFooter,
  SideBarContainer,
  TagLine,
  ToggleContainer,
} from "../styled.components";
import { CopyrightText } from "./styled.components";
import Header from "components/Header";

import dfwLogo from "../../assests/images/dfwLogo.svg";
import PlusIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Search from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LogoImg from "assests/images/Logo.svg";
import { TypeProps } from "interface";
import HomeContent from "pages/HomeContent";

const drawerWidth = {
  full: 400,
  mini: 20,
};

type SizeKey = "full" | "mini";

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sidebarType, setSidebarType] = useState<SizeKey>("full");

  const collapsed = sidebarType === "mini";

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth[sidebarType],
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth[sidebarType],
            transition: "width 0.3s ease",
            //overflowX: "hidden",
            overflow: "visible",
            display: "flex",
            backgroundColor: "#fff",
            color: "#000000",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            p: 2,
            marginLeft: "7px",
          }}
        >
          {!collapsed ? (
            <>
              <img src={LogoImg} alt="Logo" style={{ height: "40px", width: "auto" }} />
              <TagLine>Elevance Data Intelligence Platform Dashboard</TagLine>
              <ToggleContainer onClick={() => setSidebarType("mini")}>
                <SidePanelClose size="20" />
              </ToggleContainer>
            </>
          ) : (
            <ToggleContainer onClick={() => setSidebarType("full")}>
              <SidePanelOpenFilled size="20" />
            </ToggleContainer>
          )}
        </Box>
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: "16px 0",
            marginLeft: "7px",
            fontWeight: "bold",
          }}
        ></Box> */}
        {!collapsed && (
          <>
            <Divider />
            <SideBarContainer>
              <List
                sx={{
                  margin: "0",
                  padding: "0",
                }}
              >
                <img src={dfwLogo} alt="" />
              </List>
              <List>
                <InputSearchContainer>
                  <Search sx={{ width: "20px", position: "absolute", left: "5px" }} />
                  <Input type="text" name="" placeholder="Ask me anything!" />
                </InputSearchContainer>
                <Button type="button">
                  <PlusIcon /> New Chat
                </Button>
              </List>
              <List>
                <ChatContainer>
                  <ChatHeading>Chat History</ChatHeading>
                  <ChatItem className="active">
                    <ChatLeftItem>
                      <ChatTitle className="active">
                        Lorem ipsum dolor sit amet, consectetur adipis...
                      </ChatTitle>
                      <ChatDateTime>01/04/2025, 14:30</ChatDateTime>
                    </ChatLeftItem>
                    <ChatRightItem>
                      <DeleteOutlineIcon />
                    </ChatRightItem>
                  </ChatItem>
                  <ChatItem className="notActive">
                    <ChatLeftItem className="notActive">
                      <ChatTitle>Lorem ipsum dolor sit amet, consectetur adipis...</ChatTitle>
                      <ChatDateTime>01/04/2025, 14:30</ChatDateTime>
                    </ChatLeftItem>
                    <ChatRightItem>
                      <DeleteOutlineIcon />
                    </ChatRightItem>
                  </ChatItem>
                  <ChatItem className="notActive">
                    <ChatLeftItem className="notActive">
                      <ChatTitle>Lorem ipsum dolor sit amet, consectetur adipis...</ChatTitle>
                      <ChatDateTime>01/04/2025, 14:30</ChatDateTime>
                    </ChatLeftItem>
                    <ChatRightItem>
                      <DeleteOutlineIcon />
                    </ChatRightItem>
                  </ChatItem>
                </ChatContainer>
              </List>
            </SideBarContainer>
          </>
        )}
        {!collapsed && (
          <NotificationFooter>
            <List>
              <ListItem>
                <NotificationsIcon /> Notifications
              </ListItem>
              <ListItem>
                <HelpOutlineIcon /> Help
              </ListItem>
              <ListItem>
                <SettingsIcon /> Settings
              </ListItem>
              <ListItem>
                <LogoutIcon /> Log out
              </ListItem>
            </List>
          </NotificationFooter>
        )}
      </Drawer>
      {/* <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          transition: "background-color 0.3s ease",
          width: `calc(100% - ${drawerWidth[sidebarType]}px)`,
          ml: `${drawerWidth[sidebarType]}px`,
        }}
      ></AppBar> */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 10,
          backgroundColor: "background.default",
          transition: "margin 0.3s ease",
          marginTop: 0,
        }}
      >
        <HomeContent />
      </Box>
    </Box>
  );
}

export default Home;
