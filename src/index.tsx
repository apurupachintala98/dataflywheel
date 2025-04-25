import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import { Profiler } from "react";
import ReactDOM from "react-dom/client";

import renderProfiler from "./utils/renderProfiler";
import reportWebVitals from "./utils/reportWebVitals";

import "./locales/i18n";
import App from "./App";

const isProfiler = false;
const appRender = isProfiler ? (
  <Profiler id="App" onRender={renderProfiler}>
    <App />,
  </Profiler>
) : (
  <App />
);

const root = ReactDOM.createRoot(document.getElementById("cra-root") as HTMLElement);
root.render(appRender);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
