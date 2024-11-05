import React, { createContext, useContext, useMemo, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = Socket | null;
const SocketContext = createContext<SocketContextType>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socket = useMemo(() => io("http://localhost:4000"), []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
