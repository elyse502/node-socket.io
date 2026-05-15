const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  // Listening to events coming up from the client
  socket.on("send-message", (message, room) => {
    if (room === "") {
      // Emitting events to all clients except the sender
      socket.broadcast.emit("receive-message", message);
    } else {
      // Emitting events to all clients in the room
      socket.to(room).emit("receive-message", message);
    }
  });
});
