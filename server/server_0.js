const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  // Listening to events coming up from the client
  socket.on("send-message", (message) => {
    // Emitting events going down to the client
    // io.emit("receive-message", message);
    // Emitting events to all clients except the sender
    socket.broadcast.emit("receive-message", message);
  });
});
