//FIXME: 後で直す
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/common";

import { createClient } from "redis";
import htmlParser from "node-html-parser";

// --- Cache variables ---
let cachedResult: ApiResponse.Server[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const getResult = async (): Promise<ApiResponse.Server[]> => {
    try {
        (async () => {
            const now = Date.now();

            // Return cached result if it's still valid
            if (cachedResult && now - lastFetchTime < CACHE_DURATION) {
                console.log("Returning cached server list.");
                return cachedResult;
            }

            // Otherwise, fetch a new list
            console.log("Fetching new server list.");
            const result = await listup();

            // Update cache
            cachedResult = result;
            lastFetchTime = now;

            return result;
        })();
    } catch (e) {
        console.error(e);
    }

    return cachedResult ?? (await listup(true));
};

async function listup(quick?: boolean): Promise<ApiResponse.Server[]> {
    const client = createClient();
    await client.connect();
    const keys = await client.keys("relay:subscription:*");

    const hosts = keys.map((key) => key.substring(19)).filter((host) => host !== "localhost");

    if (quick) {
        return hosts.map((host) => ({ Url: `https://${host}`, Status: {} }));
    }

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
                const info = await fetch(`https://${host}/api/v2/instance`).then((r) => r.json() as Promise<any>);

                return {
                    Url: `https://${info.domain}`,
                    Title: info.title,
                    Description: info.description,
                    Color: (await getCard(host)).Color,
                    Image: info.thumbnail.url,
                    Status: { closed: !nodeinfo.openRegistrations },
                };
            }
            case "firefish":
            case "misskey": {
                const info = await fetch(`https://${host}/api/meta`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: '{"detail":false}',
                    method: "POST",
                }).then((r) => r.json() as Promise<any>);

                return {
                    Url: info.uri,
                    Title: info.name,
                    Description: info.description,
                    Color: info.themeColor,
                    Image: info.bannerUrl,
                    Status: {
                        closed: info.disableRegistration,
                        relayTimeline: nodeinfo.metadata.vmimiRelayTimelineImplemented && nodeinfo.metadata.disableVmimiRelayTimeline === false,
                    },
                };
            }
            default:
                return getCard(host);
        }
    } catch (e) {
        if ((e as any)?.cause?.code != undefined) {
            console.warn(`Error: fetch ${host}:`, `${e}, ${(e as any)?.cause?.code}`);
        } else {
            console.warn(`Error: fetch ${host}:`, e);
        }
        return {
            Url: `https://${host}`,
            Status: { error: true },
        };
    }
}

async function getCard(host: string) {
    const url = `https://${host}`;
    const f = await fetch(url);
    const card: ApiResponse.Server = { Url: url, Status: {} };

    if (f.status !== 200) {
        card.Status.error = true;
        return card;
    }

    const document = htmlParser.parse(await f.text());

    card.Title = document.querySelector("meta[property='og:title']")?.getAttribute("content");
    if (card.Title == undefined) {
        const t = document.getElementsByTagName("title");
        if (t.length > 0) card.Title = t[t.length - 1].innerText;
    }

    card.Color = document.querySelector("meta[name='theme-color']")?.getAttribute("content");
    card.Image = document.querySelector("meta[property='og:image']")?.getAttribute("content");
    return card;
}
