import { io } from "socket.io-client";

const socket = io("wss://localhost:4000", {
  path: "/socket.io/",
  transports: ["websocket"],
});

export default socket;
