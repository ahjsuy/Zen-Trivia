import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Login from "./pages/multiplayer/game/Login";
import Client from "./pages/multiplayer/game/Client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SingleClient from "./pages/SingleClient";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Home",
    element: <Login />,
  },
  {
    path: "/SingleClient",
    element: <SingleClient />,
  },
  {
    path: "/multiplayer/game/Client",
    element: <Client />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
    <RouterProvider router={router} />
    {/* </BrowserRouter> */}
  </React.StrictMode>
);
