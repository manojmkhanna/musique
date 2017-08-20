"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request-promise");
const cheerio = require("cheerio");
const song_parser_1 = require("../../../parser/song_parser");
const song_content_1 = require("../../../content/song_content");
class SaavnSongParser extends song_parser_1.default {
    createContent() {
        return new Promise((resolve, reject) => {
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
                let content = new song_content_1.default();
                content.html = html;
                resolve(content);
            })
                .catch(error => {
                reject(error);
            });
        });
    }
    // protected contentCreated(): Promise<any> {
    //     return super.contentCreated();
    // }
    createTitle() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            let title = $("h1.page-title").text();
            title = title.trim();
            resolve(title);
        });
    }
}
exports.default = SaavnSongParser;

//# sourceMappingURL=saavn_song_parser.js.map
