const { io } = require("socket.io-client");

const socket = io("http://localhost:4000");

const USER_ID = "6949001822b6593705f64b48";     // second user
const RECEIVER_ID = "69482a6fbaca7846ef5b1768"; // first user

socket.on("connect", () => {
  console.log("✅ Client 2 connected:", socket.id);

  socket.emit("login", USER_ID);
});

socket.on("newMessage", (msg) => {
  console.log("📩 Client 2 received:", msg.content);

  // reply automatically
  socket.emit("sendMessage", {
    senderId: USER_ID,
    receiverId: RECEIVER_ID,
    message: "Hello back from Client 2 🙂"
  });
});
