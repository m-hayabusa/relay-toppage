import { ApiResponse } from "common";

type MessageListenerHandler = (post: ApiResponse.Note) => void;

export default class MessageListeners {
    listeners: MessageListenerHandler[] = [];

    public fire = (post: ApiResponse.Note) => {
        this.listeners.forEach(e => e(post));
    };
    public add = (handler: MessageListenerHandler) => {
        this.listeners.push(handler);
    };
    public delete = (handler: MessageListenerHandler) => {
        this.listeners = this.listeners.filter(e => e != handler);
    };
}
