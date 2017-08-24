"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request-promise");
const cheerio = require("cheerio");
const artist_parser_1 = require("../../../parser/artist_parser");
const artist_content_1 = require("../../../content/artist_content");
const album_output_1 = require("../../../output/album_output");
const song_output_1 = require("../../../output/song_output");
const album_input_1 = require("../../../input/album_input");
const song_input_1 = require("../../../input/song_input");
class SaavnArtistParser extends artist_parser_1.default {
    constructor() {
        super(...arguments);
        this.albumPageHtmls = [];
        this.songPageHtmls = [];
    }
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
    createAlbums() {
        return this.createAlbumPage()
            .then(() => {
            let albumOutputs = this.output.albums;
            if (!albumOutputs) {
                albumOutputs = [];
            }
            for (let albumPageHtml of this.albumPageHtmls) {
                let $ = cheerio.load(albumPageHtml);
                $("h3.title>a").each((index, element) => {
                    let albumOutput = albumOutputs[index];
                    if (!albumOutput) {
                        albumOutput = new album_output_1.default();
                    }
                    albumOutput.url = $(element).attr("href");
                    albumOutput.title = $(element).text();
                    albumOutputs[index] = albumOutput;
                });
            }
            return albumOutputs;
        });
    }
    createSongs() {
        return this.createSongPage()
            .then(() => {
            let songOutputs = this.output.songs;
            if (!songOutputs) {
                songOutputs = [];
            }
            for (let songPageHtml of this.songPageHtmls) {
                let $ = cheerio.load(songPageHtml);
                $("span.title>a").each((index, element) => {
                    let songOutput = songOutputs[index];
                    if (!songOutput) {
                        songOutput = new song_output_1.default();
                    }
                    songOutput.url = $(element).attr("href");
                    songOutput.title = $(element).text();
                    songOutputs[index] = songOutput;
                });
            }
            return songOutputs;
        });
    }
    parseAlbums(outputsParser, ...indexes) {
        let promise = new Promise(resolve => {
            resolve();
        });
        if (indexes.length == 0) {
            promise = promise
                .then(() => this.createAlbumPage());
        }
        else {
            let lastIndex = indexes.sort()[indexes.length - 1];
            for (let i = this.albumPageHtmls.length; i <= Math.floor(lastIndex / 12) + 1; i++) {
                promise = promise
                    .then(() => this.createAlbumPage());
            }
        }
        return promise
            .then(() => super.parseAlbums(outputsParser, ...indexes));
    }
    parseSongs(outputsParser, ...indexes) {
        let promise = new Promise(resolve => {
            resolve();
        });
        if (indexes.length == 0) {
            promise = promise
                .then(() => this.createSongPage());
        }
        else {
            let lastIndex = indexes.sort()[indexes.length - 1];
            for (let i = this.songPageHtmls.length; i <= Math.floor(lastIndex / 10) + 1; i++) {
                promise = promise
                    .then(() => this.createSongPage());
            }
        }
        return promise
            .then(() => super.parseSongs(outputsParser, ...indexes));
    }
    createAlbumPage() {
        return request.get(this.input.url.replace("-artist", "-albums") + "?page=" + this.albumPageHtmls.length, {
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
            this.albumPageHtmls.push(html);
            let $ = cheerio.load(html);
            $("h3.title>a").each((index, element) => {
                let albumInput = new album_input_1.default();
                albumInput.url = $(element).attr("href");
                this.input.albums.push(albumInput);
            });
        });
    }
    createSongPage() {
        return request.get(this.input.url.replace("-artist", "-songs") + "?page=" + this.songPageHtmls.length, {
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
            this.songPageHtmls.push(html);
            let $ = cheerio.load(html);
            $("span.title>a").each((index, element) => {
                let songInput = new song_input_1.default();
                songInput.url = $(element).attr("href");
                this.input.songs.push(songInput);
            });
        });
    }
}
exports.default = SaavnArtistParser;

//# sourceMappingURL=saavn_artist_parser.js.map
