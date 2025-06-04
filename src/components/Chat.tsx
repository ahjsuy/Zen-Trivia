import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "../SocketContext";
import Leaderboard from "./Leaderboard";

interface Props {
  user: { role: string; username: string; icon: string; roomName: string };
}

type Message = {
  senderID: string;
  message: string;
  icon: string;
};

const Chat = ({ user }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const socket = useSocket();

  useEffect(() => {}, []);

  useEffect(() => {
    if (socket) {
      const handleMessage = (msg: string, socketID: string, icon: string) => {
        console.log("Message received, " + msg);

        setMessages((prevMessages) => [
          { senderID: socketID, message: msg, icon: icon },
          ...prevMessages,
        ]);
      };

      socket.on("message", handleMessage);

      return () => {
        socket.off("message", handleMessage);
      };
    }
  }, [socket]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (socket) {
      console.log(user.icon);
      socket.emit("sendMessage", {
        message,
        username: user.username,
        roomName: user.roomName,
        icon: user.icon,
      });
    }
    setMessage("");
  };

  return (
    <div
      className="flex-column"
      style={{
        height: "100%",
        width: "100%",
        textAlign: "center",
        color: "black",
        backgroundColor: "rgb(255,255,255, .5)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderTop: "none",
        marginLeft: "auto",
      }}
    >
      <div>
        <Leaderboard />
      </div>
      <div
        style={{
          overflowY: "auto",
          overflowWrap: "break-word",
          flexGrow: "1",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div className="flex flex-row" style={{ padding: "0.51rem" }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "3rem",
                  backgroundColor: "white",
                  borderRadius: "1rem",
                  marginBottom: "auto",
                  marginRight: ".5rem",
                }}
              >
                {msg.icon}
              </span>
              <p
                key={index}
                style={{ justifySelf: "start", textAlign: "start" }}
              >
                <b>{msg.senderID}</b>: {msg.message}
              </p>
            </div>
          ))
        ) : (
          <p>No messages</p>
        )}
      </div>
      <div>
        <form
          onSubmit={handleFormSubmit}
          style={{ display: "flex", width: "100%" }}
        >
          <div
            className="form-group"
            style={{
              flexGrow: "1",
              marginRight: "3px",
              marginLeft: "3px",
              display: "flex",
              position: "relative",
              bottom: "0px",
            }}
          >
            <input
              type="text"
              className="form-control"
              id="messageBox"
              aria-describedby="message"
              placeholder="Message"
              autoComplete="off"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              style={{ height: "100%", minWidth: "70%" }}
            />
          </div>
          <button
            type="button"
            className="roboto-slab-default no-hover"
            onClick={handleFormSubmit}
            style={{
              padding: "0 0rem 0 0rem",
              fontSize: "1rem",
              maxWidth: "30%",
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
