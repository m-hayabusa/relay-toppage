import { Card } from "card";

import "./index.scss"
import fontColorContrast from 'font-color-contrast';

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("inbox")?.addEventListener("click", e => e.preventDefault())
    fetch("list.json")
        .then(res => res.json() as Promise<Card[]>)
        .then(cards => {
            cards.sort((a, b) => {
                if (!a.Title) return 1;
                if (!b.Title) return -1;
                if (!a.OpenRegistration && b.OpenRegistration) return 1;
                if (a.OpenRegistration && !b.OpenRegistration) return -1;
                return Math.floor(Math.random() * 3) - 1;
            })
            let nasu = "";
            cards.forEach((c) => { nasu += c.OpenRegistration ? 1 : 0 })
            console.log(nasu);
            const list = document.getElementById("list");
            if (list != null)
                cards.forEach(serverInfo => {
                    const bgColor = serverInfo.Color ? serverInfo.Color : serverInfo.Error ? "#002b36" : "#eee8d5";
                    const fgColor = (() => {
                        if (serverInfo.Error)
                            return "#586e75";
                        else
                            return fontColorContrast(bgColor) + "DD";
                    })();

                    const container = document.createElement("div"); {
                        container.classList.add("container");
                        {
                            const link = document.createElement("a");
                            link.href = serverInfo.Url;
                            link.style.color = fgColor;
                            {
                                const card = document.createElement("div");
                                card.classList.add("card");
                                card.style.backgroundColor = bgColor;
                                {
                                    if (serverInfo.Image) {
                                        const thumbnail = document.createElement("div");
                                        thumbnail.classList.add("thumbnail");
                                        {
                                            const thumbnailImage = document.createElement("img");
                                            if (!serverInfo.Image.endsWith(".svg"))
                                                thumbnailImage.src = "https://virtualkemomimi.net/proxy/image.webp?url=" + encodeURIComponent(serverInfo.Image);
                                            else
                                                thumbnailImage.src = serverInfo.Image;
                                            thumbnail.appendChild(thumbnailImage);
                                        }
                                        card.appendChild(thumbnail);
                                    }

                                    const info = document.createElement("div");
                                    info.classList.add("info");
                                    if (!serverInfo.Image)
                                        info.classList.add("noimage");
                                    {
                                        const title = document.createElement("div");
                                        title.classList.add("title");
                                        title.innerText = serverInfo.Title ? serverInfo.Title : serverInfo.Url;
                                        title.innerHTML += ` <i class="fa-solid ${(() => {
                                            if (serverInfo.Error) return "fa-shop-slash"
                                            if (!serverInfo.OpenRegistration) return "fa-lock"
                                        })()}"></i>`
                                        title.style.borderBottomColor = fgColor;
                                        info.appendChild(title);
                                        const desc = document.createElement("span");
                                        desc.classList.add("desc");
                                        if (serverInfo.Description) {
                                            const cleaner = document.createElement("span");
                                            cleaner.innerHTML = serverInfo.Description;
                                            const lines = (cleaner.textContent || cleaner.innerText || "").trim().replace(/\n{2,}/g, "\n");
                                            desc.innerText = lines;
                                        }
                                        if (serverInfo.Error) desc.innerText += "(取得できませんでした)";

                                        info.appendChild(desc);
                                    }
                                    card.appendChild(info);
                                }
                                link.appendChild(card);
                            }
                            container.appendChild(link);
                        }
                        list.appendChild(container);
                    }
                });
        });
});