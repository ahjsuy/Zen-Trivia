import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "../SocketContext";

interface Props {
  user: { role: string; username: string; icon: string; roomName: string };
}

type Message = {
  senderID: string;
  message: string;
};

const Chat = ({ user }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const socket = useSocket();

  useEffect(() => {}, []);

  useEffect(() => {
    if (socket) {
      const handleMessage = (msg: string, socketID: string) => {
        setMessages((prevMessages) => [
          { senderID: socketID, message: msg },
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
      socket.emit("sendMessage", message, user.username, user.roomName);
    }
    setMessage("");
  };

  return (
    <div
      className="flex-column"
      style={{
        height: "100%",
        textAlign: "center",
        color: "black",
        backgroundColor: "white",
        width: "100%",
      }}
    >
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
            <p key={index}>
              {msg.senderID}: {msg.message}
            </p>
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
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </div>
          <button
            type="button"
            className="btn btn-light roboto-slab-default"
            onClick={handleFormSubmit}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
