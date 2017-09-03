"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request");
const cheerio = require("cheerio");
const crypto = require("crypto");
const song_parser_1 = require("../../../parser/song_parser");
const song_content_1 = require("../../../content/song_content");
const saavn_constants_1 = require("../saavn_constants");
const album_input_1 = require("../../../input/album_input");
const artist_input_1 = require("../../../input/artist_input");
const album_content_1 = require("../../../content/album_content");
const album_output_1 = require("../../../output/album_output");
const artist_output_1 = require("../../../output/artist_output");
const progress = require("request-progress");
class SaavnSongParser extends song_parser_1.default {
    createContent() {
        return new Promise((resolve, reject) => {
            request(this.input.url, saavn_constants_1.default.REQUEST_OPTIONS, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                let content = new song_content_1.default();
                content.html = body;
                resolve(content);
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
            resolve($("h2.page-subtitle").first().text().match(/ · (.+)/)[1]);
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
            let hash = JSON.parse($("div.song-json").first().text()).url;
            let cipher = crypto.createDecipheriv("des-ecb", "38346591", "");
            hash = cipher.update(hash, "base64", "ascii") + cipher.final("ascii");
            resolve("https://h.saavncdn.com" + hash.substr(10) + "_320.mp3");
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
            request(this.input.album.url, saavn_constants_1.default.REQUEST_OPTIONS, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                let albumContent = new album_content_1.default();
                albumContent.html = body;
                this.content.album = albumContent;
                let $ = cheerio.load(body);
                resolve($("li.song-wrap[data-songid=" + id + "]>div.index").first().text());
            });
        });
    }
    createFile(progressCallback) {
        return new Promise((resolve, reject) => {
            let $ = cheerio.load(this.content.html);
            let hash = JSON.parse($("div.song-json").first().text()).url;
            let cipher = crypto.createDecipheriv("des-ecb", "38346591", "");
            hash = cipher.update(hash, "base64", "ascii") + cipher.final("ascii");
            let mp3 = "https://h.saavncdn.com" + hash.substr(10) + "_320.mp3";
            progress(request(mp3, {
                encoding: null
            }, (error, response, body) => {
                if (error || response.statusCode == 403) {
                    reject(error);
                    return;
                }
                resolve(body);
            }), {
                throttle: 16
            })
                .on("progress", (state) => {
                progressCallback(state);
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
