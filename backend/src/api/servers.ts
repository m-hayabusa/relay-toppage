import { FastifyReply, FastifyRequest } from "fastify";
import { result } from "../GenerateServerList";

export const ServersHandler = (
    responce: FastifyRequest,
    reply: FastifyReply
) => {
    reply.code(200).type("application/json").send(JSON.stringify(result));
};
