"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request-promise");
const cheerio = require("cheerio");
const artist_parser_1 = require("../../../parser/artist_parser");
const artist_content_1 = require("../../../content/artist_content");
// import AlbumOutput from "../../../output/album_output";
// import SongOutput from "../../../output/song_output";
// import AlbumParser from "../../../parser/album_parser";
// import SongParser from "../../../parser/song_parser";
class SaavnArtistParser extends artist_parser_1.default {
    // private albumPageIndex: number;
    // private albumPageHtml: string[];
    // private songPageIndex: number;
    // private songPageHtml: string[];
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
                let content = new artist_content_1.default();
                content.html = html;
                resolve(content);
            })
                .catch(error => {
                reject(error);
            });
        });
    }
    contentCreated() {
        return new Promise(resolve => {
            this.input.albums = [];
            this.input.songs = [];
            resolve();
        });
    }
    createTitle() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("h1.page-title").first().text());
        });
    }
}
exports.default = SaavnArtistParser;

//# sourceMappingURL=saavn_artist_parser.js.map
