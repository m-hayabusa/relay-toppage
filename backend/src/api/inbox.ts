import { FastifyReply, FastifyRequest } from "fastify";
import MessageListeners from "../MessageListeners";
import { Activity, ApiResponse } from "common";
import NoteRepositry from "../repository/NoteRepository";

export const OnNewMessageListeners = new MessageListeners();
export const InboxHandler = async (res: FastifyRequest, rep: FastifyReply) => {
    rep.code(202).send();

    const body = res.body as Activity.Activity;

    if (body.type === "Delete" && body.object.type === "Tombstone") {
        NoteRepositry.delete(body.object.id);
        return;
    }

    if (body.type === "Create" && body.object.type === "Note") {
        const note = body.object as Activity.Note;
        note.tag = note.tag.filter(e => e.type === "Emoji");

        const person = await fetch(body.actor, {
            headers: { Accept: "application/activity+json" },
        }).then(res => res.json() as Promise<Activity.Person>);
        if (person.discoverable) {
            const newNote: ApiResponse.Note = {
                author: {
                    url: person.url,
                    icon: person.icon.url,
                    tag: person.tag,
                    isCat: person.isCat ?? false,
                },
                id: note.id,
                published: new Date(note.published),
                content: note.content,
                tag: note.tag,
                attachment: note.attachment,
                sensitive: note.sensitive,
            };
            NoteRepositry.add(newNote);
            OnNewMessageListeners.fire(newNote);
        }
    }
};
