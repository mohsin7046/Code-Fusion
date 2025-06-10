
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChannelProvider } from "./User_Section/pages/SideBar/Community/channelContext";
import { BrowserRouter } from "react-router-dom";
import SocketProvider from "./context/SocketProvider";

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <ChannelProvider>
        <SocketProvider>
        <App />
        </SocketProvider>
      </ChannelProvider>
    </BrowserRouter>
  </>
);
