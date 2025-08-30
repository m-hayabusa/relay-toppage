import * as Activity from "./Activity";

export class Note {
    author = new (class {
        name: string = "";
        url: string = "";
        icon: string = "";
        tag: Activity.Emoji[] = [];
        isCat: boolean = false;
    })();
    id: string = "";
    published: Date = new Date();
    content: string = "";
    tag: Activity.Emoji[] = [];
    attachment: Activity.Image[] = [];
    sensitive: boolean = false;
}

type ServerStatus = "error" | "closed" | "relayTimeline";

export interface Server {
    Url: string;
    Title?: string;
    Description?: string;
    Color?: string;
    Image?: string;
    Status: { [key in ServerStatus]?: boolean };
}
