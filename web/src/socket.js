import { io } from "socket.io-client";

const URL = "http://localhost:4000"; 

export const socket = io(URL, {
  autoConnect: false, // Prevents early connection without a User ID
  transports: ["websocket"],
});