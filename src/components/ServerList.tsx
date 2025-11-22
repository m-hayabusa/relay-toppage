"use client"

import React, {
    useSyncExternalStore,
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
    ]);

    const [rowItems, setRowItems] = useState<ApiResponse.Server[][]>([[], [], [],]);
    const [width, setWidth] = useState(1);

    const items = useSyncExternalStore(
        ServerListStore.subscribe,
        ServerListStore.getSnapshot,
        ServerListStore.getServerSnapshot
    );

    useEffect(() => {
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
        setRowItems([[], [], []]);

        let timeout: NodeJS.Timeout | undefined;
        let cancelled = false;

        (async () => {
            const rowItems: ApiResponse.Server[][] = [[], [], []];

            for (const item of items) {
                await new Promise(res => setTimeout(res, 20));

                if (!item || cancelled) return;

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


                rowItems[shortest].push(item);
                setRowItems([...rowItems]);
            }
        })();

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [items, width]);

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
