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

export class Server {
    constructor(params: {
        url: string;
        title?: string;
        description?: string;
        color?: string;
        image?: string;
        status?: { [key in ServerStatus]?: boolean };
    }) {
        this.Url = params.url;
        this.Title = params.title;
        this.Description = params.description;
        this.Color = params.color;
        this.Image = params.image;
        this.Status = params.status ?? {};
    }
    Url: string;
    Title?: string;
    Description?: string;
    Color?: string;
    Image?: string;
    Status: { [key in ServerStatus]?: boolean };
}
