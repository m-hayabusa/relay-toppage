import { FastifyReply, FastifyRequest } from "fastify";
import { OnNewMessageListeners } from "./inbox";
import { ApiResponse } from "@/common";
import { SocketStream } from "@fastify/websocket";
import NoteRepository from "@/lib/server/repository/NoteRepository";

export const NotesStreamHandler = async (
    websocket: SocketStream,
    request: FastifyRequest
) => {
    const handler = (post: ApiResponse.Note) => {
        websocket.socket.send(JSON.stringify(post));
    };
    OnNewMessageListeners.add(handler);
    websocket.socket.on("close", () => {
        request.log.info("WebSocket disconnected");
        OnNewMessageListeners.delete(handler);
    });
};

export const NotesHandler = (responce: FastifyRequest, reply: FastifyReply) => {
    reply
        .code(200)
        .type("application/json")
        .send(JSON.stringify(NoteRepository.getNotes()));
};
