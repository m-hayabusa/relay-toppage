export class Card {
    constructor(url: string, title?: string, description?: string, color?: string, image?: string, openRegistration = false, error = false) {
        this.Url = url;
        this.Title = title;
        this.Description = description;
        this.Color = color;
        this.Image = image;
        this.OpenRegistration = openRegistration;
        this.Error = error;
    }
    OpenRegistration: boolean;
    Url: string;
    Title: string | undefined;
    Description: string | undefined;
    Color: string | undefined;
    Image: string | undefined;
    Error: boolean;
}