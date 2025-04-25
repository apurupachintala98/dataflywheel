import { ThemeProvider as StyledProvider } from "styled-components";

import theme from "../ThemeProvider/theme";
import { ThemeProps } from "interface";

const ThemeProvider = (props: ThemeProps) => (
  <StyledProvider theme={theme}>{props.children}</StyledProvider>
);

export default ThemeProvider;
