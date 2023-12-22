import React, { useSyncExternalStore, useLayoutEffect, useState } from "react";
import ServerListItem from "./ServerListItem";
import ServerListStore from "../store/ServerListStore";
import "./ServerList.scss";

export function ServerList(props: {}) {
    console.log("Render");
    const list = useSyncExternalStore(
        ServerListStore.subscribe,
        ServerListStore.getSnapshot
    );

    const width = (): number => {
        const [size, setSize] = useState(0);
        useLayoutEffect(() => {
            const updateSize = (): void => {
                const rem = parseFloat(
                    getComputedStyle(document.documentElement).fontSize
                );
                const width = Math.floor(window.innerWidth / (52 * rem));
                setSize(width < 1 ? 1 : width);
            };

            window.addEventListener("resize", updateSize);
            updateSize();

            return () => window.removeEventListener("resize", updateSize);
        }, []);
        return size;
    };

    const items = list.map(item => {
        let count: number = 2;
        const desc = item.Description?.split("\n");
        count += desc?.length ?? 0;
        count +=
            desc
                ?.map(line => line.length / (item.Image ? 30 : 48))
                .reduce((a, b) => a + b) ?? 0;
        if (item.Image != undefined && count < 9) count = 9;
        if (item.Image == undefined && count < 4) count = 4;

        return {
            lines: count,
            item: ServerListItem(item),
        };
    });

    const rows: { lines: number; items: React.JSX.Element[] }[] = Array(width())
        .fill(undefined, 0, width())
        .map(() => {
            return { lines: 0, items: [] };
        });
    items.forEach(item => {
        const shortest = rows.sort((a, b) => {
            if (a.lines < b.lines) return -1;
            if (a.lines > b.lines) return 1;
            return 0;
        })[0];
        shortest.lines += item.lines;
        shortest.items.push(item.item);
    });

    return (
        <div className="listColumn">
            {rows.map(e => (
                <div className="listRow">{e.items}</div>
            ))}
        </div>
    );
}
