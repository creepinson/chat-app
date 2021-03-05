import fastify from "fastify";
import fsocket from "fastify-socket.io";
import { Server as SocketServer } from "socket.io";

const app = fastify({ logger: true });
const io = new SocketServer(app.server, { cors: { origin: true } });
//app.register(socketIO, {});

app.register(import("fastify-cors"));

io.on("connect", (socket) => {
    socket.on("sendMessage", (msg: string) => {
        io.sockets.emit("message", msg);
    });
    socket.on("disconnect", () => {});
});

app.listen(process.env.PORT || 8080, "0.0.0.0", (_err, address) =>
    console.log(`Listening on: ${address}`)
);
