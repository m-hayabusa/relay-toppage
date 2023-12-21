import { ApiResponse } from "common";

import { createClient } from "redis";
import htmlParser from "node-html-parser";

export let result: ApiResponse.Server[] = [];

const init = async () => {
    result = await listup();
    setInterval(
        async () => {
            console.log("updating server list");
            result = await listup();
        },
        1000 * 60 * 60
    );
};
init();

async function listup(): Promise<ApiResponse.Server[]> {
    const client = createClient();
    await client.connect();
    const keys = await client.keys("relay:subscription:*");
    const hosts = keys.map(key => key.substring(19));
    const promises: Promise<ApiResponse.Server>[] = [];
    hosts.forEach(async h => {
        promises.push(getNodeInfo(h));
    });
    const cards = await Promise.all(promises);

    cards
        .sort((a, b) => {
            if (!a.Image || b.Image) return -1;
            if (a.Image || !b.Image) return 1;
            return 0;
        })
        .sort((a, b) => {
            if (a.OpenRegistration || !b.OpenRegistration) return -1;
            if (!a.OpenRegistration || b.OpenRegistration) return 1;
            return 0;
        })
        .sort((a, b) => {
            if (!a.Title || b.Title) return 1;
            if (a.Title || !b.Title) return -1;
            return 0;
        });
    return cards;
}

async function getNodeInfo(host: string): Promise<ApiResponse.Server> {
    try {
        const f = await fetch(`https://${host}/nodeinfo/2.0`);

        if (f.status != 200) {
            throw new Error('Status code was not "OK"');
        }

        const nodeinfo = (await f.json()) as any;

        switch (nodeinfo?.software?.name) {
            case "mastodon": {
                const info = await fetch(
                    `https://${host}/api/v2/instance`
                ).then(r => r.json() as Promise<any>);
                return new ApiResponse.Server(
                    `https://${info.domain}`,
                    info.title,
                    info.description,
                    (await getCard(host)).Color,
                    info.thumbnail.url,
                    nodeinfo.openRegistrations
                );
            }
            case "firefish":
            case "misskey": {
                const info = await fetch(`https://${host}/api/meta`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: '{"detail":false}',
                    method: "POST",
                }).then(r => r.json() as Promise<any>);
                return new ApiResponse.Server(
                    info.uri,
                    info.name,
                    info.description,
                    info.themeColor,
                    info.bannerUrl,
                    !info.disableRegistration
                );
            }
            default:
                return getCard(host);
        }
    } catch (e) {
        console.warn(host, e);
        const card = new ApiResponse.Server(`https://${host}`);
        card.Error = true;
        return card;
    }
}

async function getCard(host: string) {
    const url = `https://${host}`;
    const f = await fetch(url);
    const card = new ApiResponse.Server(url);

    if (f.status !== 200) {
        card.Error = true;
        return card;
    }

    const document = htmlParser.parse(await f.text());

    card.Title = document
        .querySelector("meta[property='og:title']")
        ?.getAttribute("content");
    if (card.Title == undefined) {
        const t = document.getElementsByTagName("title");
        if (t.length > 0) card.Title = t[t.length - 1].innerText;
    }

    card.Color = document
        .querySelector("meta[name='theme-color']")
        ?.getAttribute("content");
    card.Image = document
        .querySelector("meta[property='og:image']")
        ?.getAttribute("content");
    return card;
}
