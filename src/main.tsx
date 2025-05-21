import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import Login from "./pages/multiplayer/game/Login";
// import Client from "./pages/multiplayer/game/Client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SingleClient from "./pages/SingleClient";
import { SocketProvider } from "./SocketContext";
import { UserProvider } from "./UserContext";
import SinglePlayer from "./components/SinglePlayer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/multiplayer/game/Login",
    element: <Login />,
  },
  {
    path: "/SingleClient",
    element: <SinglePlayer />,
  },
  // {
  //   path: "/multiplayer/game/Client/:roomName",
  //   element: <Client />,
  // },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <SocketProvider>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </SocketProvider>
  // </React.StrictMode>
);
