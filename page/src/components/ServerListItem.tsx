import React from "react";
import fontColorContrast from "font-color-contrast";
import { ApiResponse } from "common";

export default function ServerListItem(props: ApiResponse.Server) {
    const icon = (() => {
        if (props.Error) return "fa-shop-slash";
        if (!props.OpenRegistration) return "fa-lock";
    })();

    const bgColor = props.Color
        ? props.Color
        : props.Error
          ? "#002b36"
          : "#eee8d5";
    const fgColor = (() => {
        if (props.Error) return "#586e75";
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
                        <div
                            className="title"
                            style={{ borderBottomColor: fgColor }}
                        >
                            {props.Title ?? props.Url}{" "}
                            {icon && (
                                <i
                                    className={`fa-solid ${icon}`}
                                    aria-hidden="true"
                                ></i>
                            )}
                        </div>
                        <span className="desc">
                            {props.Error && "(正しく取得できませんでした)"}
                            {props.Description &&
                                removeHTMLTags(props.Description)}
                        </span>
                    </div>
                </div>
            </a>
        </div>
    );
}

function removeHTMLTags(text: string) {
    const cleaner = document.createElement("span");
    cleaner.innerHTML = text.replace(/<br( .*?)?\/?>/gi, "\n");
    const lines = (cleaner.textContent || cleaner.innerText || "")
        .trim()
        .replace(/\n{2,}/g, "\n");
    return lines;
}
