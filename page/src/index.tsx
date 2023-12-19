import React from "react";
import { createRoot } from "react-dom/client";

import { Header } from "./components/Header";
import { ServerList } from "./components/ServerList";

import "./index.scss";

document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    if (!app) return;
    const root = createRoot(app);
    root.render(
        <div>
            <Header />
            <ServerList />
        </div>
    );
});
