import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
html, body{
  overflow: hidden;
}
html {
    background-position: bottom right;
    background-repeat: no-repeat;
    min-height: 100%;
    @media screen and (max-width: 40em) {
    }
}
body {
    margin: 0;
    padding: 0;
    font-family: "IBM Plex Sans", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }
`;

export default GlobalStyle;
