const { io } = require("socket.io-client");

const socket = io("http://localhost:4000");

const USER_ID = "69482a6fbaca7846ef5b1768";     // real user ID from DB
const RECEIVER_ID = "6949001822b6593705f64b48"; // another real user ID

socket.on("connect", () => {
  console.log("✅ Client 1 connected:", socket.id);

  // login
  socket.emit("login", USER_ID);

  // send message after 2 seconds
  setTimeout(() => {
    socket.emit("sendMessage", {
      senderId: USER_ID,
      receiverId: RECEIVER_ID,
      message: "Hello from Client 1 👋"
    });
  }, 2000);
});

socket.on("newMessage", (msg) => {
  console.log("📩 Client 1 received:", msg.content);
});

socket.on("messageSent", (msg) => {
  console.log("✅ Client 1 sent:", msg.content);
});
