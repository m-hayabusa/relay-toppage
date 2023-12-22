import { ApiResponse } from "common";

class ServerListStore {
    static list: ApiResponse.Server[] = [];
    static listeners: (() => void)[] = [];
    public subscribe(listener: () => void) {
        ServerListStore.listeners.push(listener);
        fetch("/api/servers")
            .then(res => res.json() as Promise<ApiResponse.Server[]>)
            .then(cards =>
                cards
                    .sort((a, b) => {
                        if (!a.Title) return 1;
                        if (!b.Title) return -1;
                        if (!a.OpenRegistration && b.OpenRegistration) return 1;
                        if (a.OpenRegistration && !b.OpenRegistration)
                            return -1;
                        return Math.floor(Math.random() * 3) - 1;
                    })
                    .map(e => {
                        e.Description =
                            e.Description && removeHTMLTags(e.Description);
                        return e;
                    })
            )
            .then(cards => {
                ServerListStore.list = cards;
                ServerListStore.listeners.forEach(listener => listener());
            });
        return () => {};
    }
    public getSnapshot() {
        return ServerListStore.list;
    }
}

function removeHTMLTags(text: string) {
    return text
        .replace(/<script( .*?)?>(.*<\/script( .*?)?>)?/gi, "\n")
        .replace(/<style( .*?)?>.*?<\/style( .*?)?>/gi, "\n")
        .replace(/<br( .*?)?\/?>/gi, "\n")
        .replace(/<\/?p( .*?)?>/gi, "\n")
        .replace(/<.+?>/g, "")
        .trim()
        .replace(/\n{3,}/g, "\n");
}

export default new ServerListStore();
