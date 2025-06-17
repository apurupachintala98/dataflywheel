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
import { useNavigate, Link } from "react-router-dom";
import newChat from "assests/images/newChat.svg";

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
import dfwLogo from "../../assests/images/DFWLogo.png";
import PlusIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Search from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

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
import RecentHistory from "components/RecentHistory";

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
  const [isReset, setIsReset] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [recentValue, setRecentValue] = useState("");

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
              <Link
                to="/"
                style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
              >
                <img src={LogoImg} alt="Logo" style={{ height: "40px", width: "auto" }} />
                <TagLine style={{ color: "#000", marginLeft: "10px" }}>
                  Data Intelligence Platform
                </TagLine>
              </Link>
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
                <img src={dfwLogo} alt="" style={{ width: "60%", height: "auto" }} />
              </List>
              <List>
                <Button
                  type="button"
                  onClick={() => {
                    setIsReset(!isReset);
                    setPromptValue("");
                    setRecentValue("");
                  }}
                >
                  <img src={newChat} /> New Chat
                </Button>
              </List>
              {/* <History />     */}
              <RecentHistory
                title={"Prompt"}
                isDotVisible={false}
                list={[
                  {
                    title: "Prompt I",
                    isActive: promptValue === "Prompt I" ? true : false,
                    onTitleClick: setPromptValue,
                  },
                  {
                    title: "Prompt II",
                    isActive: promptValue === "Prompt II" ? true : false,
                    onTitleClick: setPromptValue,
                  },
                ]}
              />
              <RecentHistory
                title={"Recent"}
                isDotVisible={true}
                list={[
                  {
                    title: "What is the FMC denominator based on in HEDIS?",
                    isActive: false,
                    onTitleClick: setRecentValue,
                  },
                  {
                    title: "What is considered continuous enrollment for FMC in HEDIS?",
                    isActive: false,
                    onTitleClick: setRecentValue,
                  },
                ]}
              />
            </SideBarContainer>
          </>
        )}
        {!collapsed && (
          <NotificationFooter>
            <List sx={{ color: "#5d5d5d" }}>
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
      <Box
        component="main"
        sx={{
          flexGrow: 2,
          mt: 10,
          backgroundColor: "background.default",
          transition: "margin 0.3s ease",
          marginTop: 0,
        }}
      >
        <HomeContent isReset={isReset} promptValue={promptValue} recentValue={recentValue} />
      </Box>
    </Box>
  );
}

export default Home;
