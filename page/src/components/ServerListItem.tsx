import React from "react";
import fontColorContrast from "font-color-contrast";
import { ApiResponse } from "common";
import "./ServerListItem.scss";

export default function ServerListItem(props: ApiResponse.Server) {
    const icons: { name: string; label: string; description: string }[] = [];

    if (props.Status.error)
        icons.push({
            name: "fa-shop-slash",
            label: "エラー",
            description: "情報の取得に失敗しました",
        });
    if (props.Status.closed)
        icons.push({
            name: "fa-lock",
            label: "招待制",
            description: "登録には、招待コードが必要です",
        });
    if (props.Status.relayTimeline)
        icons.push({
            name: "fa-circle-nodes",
            label: "リレーTL",
            description: "参加サーバーの投稿を見られるタイムラインがある",
        });

    const bgColor = props.Color ?? (props.Status.error ? "#002b36" : "#eee8d5");
    const fgColor = (() => {
        if (props.Status.error) return "#586e75";
        else return fontColorContrast(bgColor) + "DD";
    })();

    return (
        <div className="container">
            <a href={props.Url}>
                <div
                    className="card"
                    style={{ color: fgColor, background: bgColor }}
                >
                    {props.Image && (
                        <div className="thumbnail">
                            <img
                                src={
                                    props.Image.endsWith(".svg")
                                        ? props.Image
                                        : `https://virtualkemomimi.net/proxy/image.webp?url=${encodeURIComponent(
                                              props.Image
                                          )}`
                                }
                            />
                        </div>
                    )}
                    <div className={"info" + (props.Image ? "" : " noimage")}>
                        <div className="title">
                            <span className="name">
                                {props.Title ?? props.Url}
                            </span>
                            <span className="icons">
                                {icons.map(icon => (
                                    <span className="icon">
                                        <i
                                            className={`fa-solid ${icon.name}`}
                                        />
                                        <span className="label">
                                            {icon.label}
                                        </span>
                                        <span className="tooltip">
                                            {icon.description}
                                        </span>
                                    </span>
                                ))}
                            </span>
                        </div>
                        {props.Description && (
                            <>
                                <hr />
                                <div className="desc">{props.Description}</div>
                            </>
                        )}
                    </div>
                </div>
            </a>
        </div>
    );
}
