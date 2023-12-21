import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { InboxHandler } from "./api/inbox";
import { NotesHandler, NotesStreamHandler } from "./api/notes";
import { ServersHandler } from "./api/servers";

const isDev = process.env["NODE_ENV"] === "development";
const server = fastify({
    logger: !isDev
        ? true
        : {
              transport: {
                  target: "pino-pretty",
                  options: {
                      ignore: "pid, hostname",
                  },
              },
          },
});

server.register(fastifyWebsocket);
server.register(fastifyStatic, {
    root: path.join(__dirname, "../../page/public"),
});

server.register(async server => {
    server.get("/", (req, reply) => {
        reply.sendFile("index.html");
    });
    server.get("/index.htm", (req, reply) => {
        reply.redirect("/");
    });

    server.post("/inbox", InboxHandler);

    server.get("/api/notes", NotesHandler);
    server.get("/api/notes/stream", { websocket: true }, NotesStreamHandler);

    server.get("/api/servers", ServersHandler);
});

server.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
