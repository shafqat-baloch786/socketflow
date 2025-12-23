// Install socket.io-client first if you haven't:
// npm install socket.io-client

const { io } = require("socket.io-client");

// Replace with your server URL and port
const SERVER_URL = "http://localhost:4000";

// Connect to Socket.IO server
const socket = io(SERVER_URL);

// When connected
socket.on("connect", () => {
  console.log("✅ Connected to Socket.IO server!");
  console.log("Socket ID:", socket.id);

  // Send a test event to the server
  socket.emit("hello", "Hi server! This is client.js");
});

// Listen for a reply from the server
socket.on("reply", (message) => {
  console.log("📩 Server says:", message);
});

// When disconnected
socket.on("disconnect", () => {
  console.log("❌ Disconnected from server!");
});
