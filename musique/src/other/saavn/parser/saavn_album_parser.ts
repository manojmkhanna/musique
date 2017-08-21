import * as Promise from "bluebird";
import * as request from "request-promise";
import * as cheerio from "cheerio";

import AlbumParser from "../../../parser/album_parser";
import AlbumContent from "../../../content/album_content";

export default class SaavnAlbumParser extends AlbumParser {
    protected createContent(): Promise<AlbumContent> {
        return new Promise<AlbumContent>((resolve, reject) => {
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
                    let content = new AlbumContent();
                    content.html = html;

                    resolve(content);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    // protected contentCreated(): Promise<any> {  //TODO
    //     return new Promise<any>(() => {
    //     });
    // }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            let title = $("h1.page-title").text();
            title = title.trim();

            resolve(title);
        });
    }
}
