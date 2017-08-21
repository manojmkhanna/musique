import * as Promise from "bluebird";
import * as request from "request-promise";
import * as cheerio from "cheerio";

import PlaylistParser from "../../../parser/playlist_parser";
import PlaylistContent from "../../../content/playlist_content";

export default class SaavnPlaylistParser extends PlaylistParser {
    protected createContent(): Promise<PlaylistContent> {
        return new Promise<PlaylistContent>((resolve, reject) => {
            request.get(this.input.url, {
                headers: {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "en,en-US;q=0.8",
                    "Cache-Control": "max-age=0",
                    "Connection": "keep-alive",
                    "DNT": "1",
                    "Host": "www.saavn.com",
                    "Upgrade-Insecure-Requests": "1",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36"
                },
                gzip: true
            })
                .then(html => {
                    let content = new PlaylistContent();
                    content.html = html;

                    resolve(content);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    protected contentCreated(): Promise<any> {
        return new Promise<any>(() => {
        });
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            let title = $("h1.page-title").text();
            title = title.trim();

            resolve(title);
        });
    }
}
