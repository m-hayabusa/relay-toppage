"use client"

import React, {
    useSyncExternalStore,
    useLayoutEffect,
    useState,
    useRef,
    createRef,
    useEffect,
} from "react";
import ServerListItem from "./ServerListItem";
import ServerListStore from "../store/ServerListStore";
import "./ServerList.scss";
import { ApiResponse } from "@/common";

export function ServerList() {
    const listColumn = useRef<HTMLDivElement>(null);
    const listRows = useRef([
        createRef<HTMLDivElement>(),
        createRef<HTMLDivElement>(),
        createRef<HTMLDivElement>(),
        createRef<HTMLDivElement>(),
    ]);

    const [rowItems, setRowItems] = useState<ApiResponse.Server[][]>([
        [],
        [],
        [],
    ]);
    const [width, setWidth] = useState(1);
    const [count, setCount] = useState(0);

    const items = useSyncExternalStore(
        ServerListStore.subscribe,
        ServerListStore.getSnapshot,
        ServerListStore.getServerSnapshot
    );

    useLayoutEffect(() => {
        const updateSize = (): void => {
            const rem = parseFloat(
                getComputedStyle(document.documentElement).fontSize
            );
            const width = Math.floor(
                (listColumn.current?.clientWidth ?? 1) / (42 * rem)
            );
            setWidth(width < 1 ? 1 : width <= 3 ? width : 3);
        };

        updateSize();

        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    useEffect(() => {
        setCount(0);
        setRowItems([[], [], []]);
    }, [width]);

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined;
        (async () => {
            for (let i = count; i < items.length; i++) {
                await new Promise(res => {
                    timeout = setTimeout(res, 20);
                });

                const item = items[i];
                if (!item) return;

                const shortest = listRows.current
                    .map((row, index) => ({
                        index,
                        height: row.current?.clientHeight ?? Infinity,
                    }))
                    .sort((a, b) => {
                        if (a.height < b.height) return -1;
                        if (a.height > b.height) return 1;
                        return Math.floor(Math.random() * 3) - 1;
                    })[0].index;

                setRowItems(rowItems => {
                    rowItems[shortest].push(item);
                    return rowItems;
                });
                setCount(count => count + 1);
            }
        })();

        return () => {
            clearTimeout(timeout);
        };
    }, [count, items]);

    return (
        <div className="listColumn" ref={listColumn}>
            {rowItems.slice(0, width).map((cards, i) => (
                <div className="listRow" ref={listRows.current[i]} key={i}>
                    {cards.map((card, j) => (
                        <ServerListItem {...card} key={j} />
                    ))}
                </div>
            ))}
        </div>
    );
}
