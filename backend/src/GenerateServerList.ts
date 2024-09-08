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
    const hosts = keys
        .map(key => key.substring(19))
        .filter(host => host !== "localhost");

    return Promise.all(hosts.map(getNodeInfo));
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

                return new ApiResponse.Server({
                    url: `https://${info.domain}`,
                    title: info.title,
                    description: info.description,
                    color: (await getCard(host)).Color,
                    image: info.thumbnail.url,
                    status: {},
                });
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

                return new ApiResponse.Server({
                    url: info.uri,
                    title: info.name,
                    description: info.description,
                    color: info.themeColor,
                    image: info.bannerUrl,
                    status: {
                        closed: info.disableRegistration,
                        relayTimeline:
                            info.vmimiRelayTimelineImplemented &&
                            info.disableVmimiRelayTimeline === false,
                    },
                });
            }
            default:
                return getCard(host);
        }
    } catch (e) {
        if ((e as any)?.cause?.code != undefined) {
            console.warn(
                `Error: fetch ${host}:`,
                `${e}, ${(e as any)?.cause?.code}`
            );
        } else {
            console.warn(`Error: fetch ${host}:`, e);
        }
        return new ApiResponse.Server({
            url: `https://${host}`,
            status: { error: true },
        });
    }
}

async function getCard(host: string) {
    const url = `https://${host}`;
    const f = await fetch(url);
    const card = new ApiResponse.Server({ url });

    if (f.status !== 200) {
        card.Status.error = true;
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
