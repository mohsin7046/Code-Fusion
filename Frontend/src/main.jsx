import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import SocketProvider from "./context/SocketProvider";

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
        <SocketProvider>
        <App />
        </SocketProvider>
    </BrowserRouter>
  </>
);
