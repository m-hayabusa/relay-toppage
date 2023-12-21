export type Image = {
    type: "Image";
    url: string;
    sensitive: boolean | undefined;
};

export type Emoji = {
    type: "Emoji";
    name: string;
    icon: Image;
};

export type Content = {
    id: string;
    type: string;
};

export type Person = Content & {
    type: "Person";
    url: string;
    discoverable: boolean;
    published: string;
    isCat: boolean | undefined;
    icon: Image;
    tag: Emoji[];
};

export type Note = Content & {
    type: "Note";
    published: string;
    content: string;
    sensitive: boolean;
    attachment: Image[];
    tag: Emoji[];
};

export type Activity = {
    actor: string;
    type: string;
    published: string;
    object: Content;
};
