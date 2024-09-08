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

export function ServerList() {
    const listColumn = useRef<HTMLDivElement>(null);
    const listRows = useRef<React.RefObject<HTMLDivElement>[]>([
        createRef<HTMLDivElement>(),
        createRef<HTMLDivElement>(),
        createRef<HTMLDivElement>(),
    ]);

    const [rowItems, setRowItems] = useState<JSX.Element[][]>([[], [], []]);
    const [width, setWidth] = useState(1);
    const [count, setCount] = useState(0);

    const items = useSyncExternalStore(
        ServerListStore.subscribe,
        ServerListStore.getSnapshot
    ).map(ServerListItem);

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
        if (count !== 0) return;

        (async () => {
            for (let i = 0; i < items.length; i++) {
                await new Promise(res => setTimeout(res, 10));

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
                        return 0;
                    })[0].index;

                setRowItems(rowItems => {
                    rowItems[shortest].push(item);
                    return rowItems;
                });
                setCount(count => count + 1);
            }
        })();
    }, [count, items]);

    return (
        <div className="listColumn" ref={listColumn}>
            {rowItems.map(
                (e, i) =>
                    i < width && (
                        <div
                            className="listRow"
                            ref={listRows.current[i]}
                            key={i}
                        >
                            {e}
                        </div>
                    )
            )}
        </div>
    );
}
