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
    font-family: "Poppins", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }

  .citation {
  position: relative;
  cursor: pointer;
  color: #0f62fe;
  font-weight: bold;
}
.citation::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 125%;
  background: #000;
  color: #fff;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 4px;
  display: none;
  white-space: nowrap;
  z-index: 1000;
}
.citation:hover::after {
  display: block;
}

`;

export default GlobalStyle;
