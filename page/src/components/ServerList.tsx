import React, { useSyncExternalStore } from "react";
import ServerListItem from "./ServerListItem";
import ServerListStore from "../store/ServerListStore";
import "./ServerList.scss";

export function ServerList() {
    const list = useSyncExternalStore(
        ServerListStore.subscribe,
        ServerListStore.getSnapshot
    );
    return <div className="list">{list.map(e => ServerListItem(e))}</div>;
}
