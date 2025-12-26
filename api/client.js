const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:4000";
const socket = io(SERVER_URL);

// Use the ID of the user you want to bring "Online"
const TEST_USER_ID = "694e76d4ecedd376187caaec"; 

socket.on("connect", () => {
  console.log("✅ Connected! Socket ID:", socket.id);

  console.log(`🚀 Emitting 'login' for User: ${TEST_USER_ID}`);
  socket.emit("login", TEST_USER_ID);
});

// Listen for the broadcast the server sends out when someone logs in
socket.on("userStatusChanged", (data) => {
  console.log("📢 Server Broadcast Received:", data);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});