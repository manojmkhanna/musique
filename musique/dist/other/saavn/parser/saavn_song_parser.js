"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request-promise");
const cheerio = require("cheerio");
const crypto = require("crypto");
const song_parser_1 = require("../../../parser/song_parser");
const song_content_1 = require("../../../content/song_content");
const album_input_1 = require("../../../input/album_input");
const artist_input_1 = require("../../../input/artist_input");
const album_output_1 = require("../../../output/album_output");
const artist_output_1 = require("../../../output/artist_output");
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
    contentCreated() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            let albumInput = new album_input_1.default();
            let artistInputs = [];
            $("h2.page-subtitle>a").each((index, element) => {
                if (index == 0) {
                    albumInput.url = $(element).attr("href");
                }
                else {
                    let artistInput = new artist_input_1.default();
                    artistInput.url = $(element).attr("href").replace("-albums", "-artist");
                    artistInputs[index - 1] = artistInput;
                }
            });
            this.input.album = albumInput;
            this.input.artists = artistInputs;
            resolve();
        });
    }
    createDuration() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("h2.page-subtitle").first().text().match(/ · (.+)$/)[1]);
        });
    }
    createLyrics() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            let lyrics = $("h2.page-subtitle:contains(Lyrics)+p").first().html();
            if (lyrics) {
                resolve(lyrics.replace(/(<br>){2,}/g, "\n\n").replace(/<br>/g, "\n"));
            }
            else {
                resolve();
            }
        });
    }
    createMp3() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            let cipher = crypto.createDecipheriv("des-ecb", "38346591", "");
            let buffer = Buffer.from(JSON.parse($("div.song-json").first().text()).url, "base64");
            buffer = Buffer.concat([cipher.update(buffer), cipher.final()]);
            resolve("https://h.saavncdn.com" + buffer.toString().substr(10) + "_320.mp3");
        });
    }
    createTitle() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("h1.page-title").first().text().trim());
        });
    }
    createTrack() {
        return new Promise((resolve, reject) => {
            let $ = cheerio.load(this.content.html);
            let id = JSON.parse($("div.song-json").first().text()).songid;
            request.get(this.input.album.url, {
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
                let $ = cheerio.load(html);
                resolve(parseInt($("li.song-wrap[data-songid=" + id + "]>div.index").first().text()));
            })
                .catch(error => {
                reject(error);
            });
        });
    }
    createAlbum() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            let albumOutput = this.output.album;
            if (!albumOutput) {
                albumOutput = new album_output_1.default();
            }
            let element = $("h2.page-subtitle>a").first();
            albumOutput.url = element.attr("href");
            albumOutput.title = element.text();
            resolve(albumOutput);
        });
    }
    createArtists() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            let artistOutputs = this.output.artists;
            if (!artistOutputs) {
                artistOutputs = [];
            }
            $("h2.page-subtitle>a").each((index, element) => {
                if (index > 0) {
                    let artistOutput = artistOutputs[index];
                    if (!artistOutput) {
                        artistOutput = new artist_output_1.default();
                    }
                    artistOutput.url = $(element).attr("href").replace("-albums", "-artist");
                    artistOutput.title = $(element).text();
                    artistOutputs[index - 1] = artistOutput;
                }
            });
            resolve(artistOutputs);
        });
    }
}
exports.default = SaavnSongParser;

//# sourceMappingURL=saavn_song_parser.js.map
