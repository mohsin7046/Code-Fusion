import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChannelProvider } from "./User_Section/pages/SideBar/Community/channelContext";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <ChannelProvider>
        <App />
      </ChannelProvider>
    </BrowserRouter>
  </>
);
