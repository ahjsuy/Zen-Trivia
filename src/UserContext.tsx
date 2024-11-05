import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { io, Socket } from "socket.io-client";

type UserContextType = {
  user: {
    role: string;
    username: string;
    icon: string;
    roomName: string;
  };
  setUser: Dispatch<
    SetStateAction<{
      role: string;
      username: string;
      icon: string;
      roomName: string;
    }>
  >;
};
const UserContext = createContext<UserContextType>({
  user: {
    role: "",
    username: "",
    icon: "",
    roomName: "",
  },
  setUser: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState({
    role: "",
    username: "",
    icon: "",
    roomName: "",
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
