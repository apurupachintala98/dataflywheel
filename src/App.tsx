import { Theme } from "@carbon/react";
import { StrictMode } from "react";
import { HelmetProvider } from "react-helmet-async";

import ThemeProvider from "./components/ThemeProvider";
import GlobalStyle from "./styled.components";

import "./App.scss";
import { AuthProvider } from "./contexts/AuthContext";
import Routes from "./routes";

function App() {
  const theme = "g10";
  return (
    <Theme theme={theme}>
      <ThemeProvider theme="light">
        <HelmetProvider>
          <StrictMode>
            <AuthProvider>
              <GlobalStyle />
              <Routes />
            </AuthProvider>
          </StrictMode>
        </HelmetProvider>
      </ThemeProvider>
    </Theme>
  );
}

export default App;
