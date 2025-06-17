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

.custom-scroll {
  scrollbar-width: thin; 
  scrollbar-color: #999 #eee; 
}

.custom-scroll::-webkit-scrollbar {
  height: 8px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 4px;
}

.custom-scroll::-webkit-scrollbar-track {
  background-color: #eee;
}

.gradientText{
background-image: linear-gradient(45deg, #1a949f, #002d9c); 
-webkit-background-clip: text; 
background-clip: text; 
-webkit-text-fill-color: transparent;
color: #000;
}
`;

export default GlobalStyle;
