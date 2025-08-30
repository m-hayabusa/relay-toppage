import { result } from "@/lib/server/GenerateServerList";
import { FastifyReply, FastifyRequest } from "fastify";

export const ServersHandler = (
    responce: FastifyRequest,
    reply: FastifyReply
) => {
    reply.code(200).type("application/json").send(JSON.stringify(result));
};
