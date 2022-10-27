import React from "react";
import ReactDOM from "react-dom/client";
import store from "@store";
import App from "./App";
import { Provider } from "react-redux";
import "./global.less";
import "antd-mobile/es/global";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
