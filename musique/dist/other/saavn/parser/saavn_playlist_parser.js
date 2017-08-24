"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request-promise");
const cheerio = require("cheerio");
const playlist_parser_1 = require("../../../parser/playlist_parser");
const playlist_content_1 = require("../../../content/playlist_content");
const song_input_1 = require("../../../input/song_input");
const song_output_1 = require("../../../output/song_output");
class SaavnPlaylistParser extends playlist_parser_1.default {
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
                let content = new playlist_content_1.default();
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
            let $ = cheerio.load(this.content.html);
            let songInputs = [];
            $("span.title>a").each((index, element) => {
                let songInput = new song_input_1.default();
                songInput.url = $(element).attr("href");
                songInputs[index] = songInput;
            });
            this.input.songs = songInputs;
            resolve();
        });
    }
    createTitle() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("h1.page-title").first().text());
        });
    }
    createSongs() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            let songOutputs = this.output.songs;
            if (!songOutputs) {
                songOutputs = [];
            }
            $("span.title>a").each((index, element) => {
                let songOutput = songOutputs[index];
                if (!songOutput) {
                    songOutput = new song_output_1.default();
                }
                songOutput.url = $(element).attr("href");
                songOutput.title = $(element).text();
                songOutputs[index] = songOutput;
            });
            resolve(songOutputs);
        });
    }
}
exports.default = SaavnPlaylistParser;

//# sourceMappingURL=saavn_playlist_parser.js.map
