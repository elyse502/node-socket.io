const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  // Listening to events coming up from the client
  socket.on("custom-event", (number, string, obj) => {
    console.log(number, string, obj);
  });
});
