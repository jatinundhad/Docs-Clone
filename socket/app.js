const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:5173",
    method: ["GET", "POST"],
  },
});
const dotenv = require("dotenv");
const path = require("path");
const { connectToMongo } = require(path.join(__dirname, "dbConnect.js"));
const documentSchema = require(path.join(__dirname, "models", "Document"));

dotenv.config({
  path: path.join(__dirname, ".env"),
});

connectToMongo();

let allRooms = {};

io.on("connection", (socket) => {
  let socketId = socket.id;
  socket.on("userConnectedClientToServer", (args) => {
    if (args.documentId in allRooms) {
      allRooms[args.documentId][args.user.userId] = {
        socketId,
        ...args.user.userId,
      };
    } else {
      allRooms[args.documentId] = {
        [args.user.userId]: {
          socketId,
          ...args.user,
        },
      };
    }
    socket.join(args.documentId);
    io.to(args.documentId)
      .except(socketId)
      .emit("userConnectedServerToClient", {
        user: args.user,
      });

    socket.on("textChangeClientToServer", (args) => {
      new Promise(async (resolve, reject) => {
        await documentSchema.findByIdAndUpdate(args.documentId, {
          content: args.content,
        });
        io.to(args.documentId)
          .except(socketId)
          .emit("textChangeServerToClient", {
            delta: args.delta,
          });
      });
    });

    socket.on("editorSelectionChangeClientToServer", (args) => {
      io.to(args.documentId)
        .except(socketId)
        .emit("editorSelectionChangeServerToClient", {
          range: args.range,
          user: args.user,
          socketId,
        });
    });
  });
  socket.on("disconnectingClientToServer", (args) => {
    if (args.user.userId) {
      delete allRooms[args.documentId][args.user.userId];
    }
    if (Object.keys(allRooms[args.documentId]).length == 0)
      delete allRooms[args.documentId];
    io.to(args.documentId)
      .except(socketId)
      .emit("disconnectingServerToClient", {
        user: args.user,
        socketId,
      });
    socket.leave(args.documentId);
  });
});

io.on("disconnect", () => {});
