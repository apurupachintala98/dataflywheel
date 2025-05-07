import { Theme } from "@carbon/react";
import { StrictMode, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { setupHighchartsModules } from './highcharts-setup';

import ThemeProvider from "./components/ThemeProvider";
import GlobalStyle from "./styled.components";

import "./App.scss";
import { AuthProvider } from "./contexts/AuthContext";
import Routes from "./routes";

function App() {
  const theme = "g10";
  useEffect(() => {
    setupHighchartsModules();
  }, []);
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
