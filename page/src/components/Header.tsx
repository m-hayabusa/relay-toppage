import React from "react";
import "./Header.scss";

export function Header() {
    return (
        <header>
            <h1>relay.VirtualKemomimi.net</h1>
            <p>
                VRChatとかResoniteとかClusterとかそのあたりのユーザーを想定した小規模サーバー向けのリレーサーバーです。
            </p>
            <ul>
                <li>
                    Inbox:{" "}
                    <a href="/inbox" onClick={e => e.preventDefault()}>
                        relay.VirtualKemomimi.net/inbox
                    </a>
                </li>
                <li>
                    Contact: ActivityPub{" "}
                    <a href="https://mewl.me/@mewl">@mewl@mewl.me</a>
                </li>
                <li>
                    Powered by{" "}
                    <a href="https://github.com/yukimochi/Activity-Relay">
                        Yukimochi/Activity-Relay
                    </a>
                </li>
            </ul>
        </header>
    );
}
