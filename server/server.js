const http = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://admin.socket.io"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

// Creating a different namespace for users
const userIo = io.of("/user");

userIo.on("connection", (socket) => {
  console.log("connected to user namespace with username: " + socket.username);
});

userIo.use((socket, next) => {
  if (socket.handshake.auth.token) {
    socket.username = getUsernameFromToken(socket.handshake.auth.token);
    next();
  } else {
    next(new Error("Please send token"));
  }
});

function getUsernameFromToken(token) {
  return token;
}

io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.on("send-message", (message, room) => {
    if (!room) {
      socket.broadcast.emit("receive-message", message);
    } else {
      socket.to(room).emit("receive-message", message);
    }
  });

  socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb(`Joined ${room}`);
  });

  socket.on("ping", (n) => console.log(n));
});

server.listen(3000, () => {
  console.log("Socket.IO server running on 3000");
});
