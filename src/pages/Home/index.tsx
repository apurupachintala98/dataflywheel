import { TextInput } from "@carbon/react";
import {
  Analytics,
  Dashboard as DashboardIcon,
  IbmCloudProjects,
  SidePanelClose,
  SidePanelOpenFilled,
} from "@carbon/react/icons";
import { useEffect, useState } from "react";
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
  CopyrightFooter,
  Input,
  InputSearchContainer,
  Loader,
  NotificationFooter,
  SideBar,
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
import DataFlyWheelLogo from "assests/images/loding.png";

import { listProps, TypeProps } from "interface";
import HomeContent from "pages/HomeContent";
import RecentHistory from "components/RecentHistory";
import { usePromptData } from "hooks/usePromptData";

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
  const [promptData, setPromptData] = useState<listProps[]>([]);
  const [recentValue, setRecentValue] = useState("");
  const [checkIsLogin, setCheckIsLogin] = useState(true);
  const [isLogOut, setIsLogOut] = useState(false);
  const { prompts } = usePromptData();

  useEffect(() => {
    if (prompts.length > 0) {
      const data = prompts.map((item) => ({
        id: item.id,
        title: item.prompt_title,
        isActive: promptValue === item.prompt_title,
        onTitleClick: setPromptValue,
      }));
      setPromptData(data);
      console.log("data::", data);
    }
  }, [prompts, promptValue]);

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
                <TagLine style={{ color: "#373535", marginLeft: "10px" }}>
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
            <SideBar>
              <List
                sx={{
                  margin: "0",
                  padding: "15px 0 0",
                }}
              >
                <Loader src={DataFlyWheelLogo} style={{ width: "45px" }} />
                <img
                  src={dfwLogo}
                  alt=""
                  style={{ width: "60%", height: "auto", padding: "8px 10px" }}
                />
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
            </SideBar>
            <Divider />

            <SideBarContainer>
              <RecentHistory
                isAddButtonEnable={true}
                title={"Prompt"}
                isDotVisible={false}
                list={promptData}
              />
              {/* <RecentHistory
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
              /> */}
            </SideBarContainer>
          </>
        )}
        {!collapsed && (
          <NotificationFooter isLogin={checkIsLogin}>
            {checkIsLogin && (
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
                <ListItem onClick={() => setIsLogOut(!isLogOut)}>
                  <LogoutIcon /> Log out
                </ListItem>
              </List>
            )}
            <CopyrightFooter>
              Copyright &copy; 2025 DataFlyWheel, All Rights Reserved.
            </CopyrightFooter>
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
        <HomeContent
          isReset={isReset}
          promptValue={promptValue}
          recentValue={recentValue}
          isLogOut={isLogOut}
          setCheckIsLogin={setCheckIsLogin}
        />
      </Box>
    </Box>
  );
}

export default Home;
