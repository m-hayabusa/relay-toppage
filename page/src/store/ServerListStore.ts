import { Card } from "card";

class ServerListStore {
    static list: Card[] = [];
    static listeners: (() => void)[] = [];
    public subscribe(listener: () => void) {
        ServerListStore.listeners.push(listener);
        fetch("list.json")
            .then(res => res.json() as Promise<Card[]>)
            .then(cards =>
                cards.sort((a, b) => {
                    if (!a.Title) return 1;
                    if (!b.Title) return -1;
                    if (!a.OpenRegistration && b.OpenRegistration) return 1;
                    if (a.OpenRegistration && !b.OpenRegistration) return -1;
                    return Math.floor(Math.random() * 3) - 1;
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
export default new ServerListStore();
