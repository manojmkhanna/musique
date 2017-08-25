"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request-promise");
const cheerio = require("cheerio");
const search_parser_1 = require("../../../parser/search_parser");
const song_output_1 = require("../../../output/song_output");
const album_output_1 = require("../../../output/album_output");
const playlist_output_1 = require("../../../output/playlist_output");
const saavn_constants_1 = require("../saavn_constants");
const song_input_1 = require("../../../input/song_input");
const album_input_1 = require("../../../input/album_input");
const playlist_input_1 = require("../../../input/playlist_input");
class SaavnSearchParser extends search_parser_1.default {
    constructor() {
        super(...arguments);
        this.songPageHtmls = [];
        this.albumPageHtmls = [];
        this.playlistPageHtmls = [];
    }
    contentCreated() {
        return new Promise(resolve => {
            this.input.songs = [];
            this.input.albums = [];
            this.input.playlists = [];
            resolve();
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
    createPlaylists() {
        return this.createPlaylistPage()
            .then(() => {
            let playlistOutputs = this.output.playlists;
            if (!playlistOutputs) {
                playlistOutputs = [];
            }
            for (let playlistPageHtml of this.playlistPageHtmls) {
                let $ = cheerio.load(playlistPageHtml);
                $("h3>a").each((index, element) => {
                    let playlistOutput = playlistOutputs[index];
                    if (!playlistOutput) {
                        playlistOutput = new playlist_output_1.default();
                    }
                    playlistOutput.url = $(element).attr("href");
                    playlistOutput.title = $(element).text();
                    playlistOutputs[index] = playlistOutput;
                });
            }
            return playlistOutputs;
        });
    }
    parseSongs(outputsParser, ...indexes) {
        let promise = new Promise(resolve => {
            resolve();
        });
        if (indexes.length == 0) {
            promise = promise.then(() => this.createSongPage());
        }
        else {
            let lastIndex = indexes.sort()[indexes.length - 1];
            for (let i = this.songPageHtmls.length; i <= Math.floor(lastIndex / 10) + 1; i++) {
                promise = promise.then(() => this.createSongPage());
            }
        }
        return promise.then(() => super.parseSongs(outputsParser, ...indexes));
    }
    parseAlbums(outputsParser, ...indexes) {
        let promise = new Promise(resolve => {
            resolve();
        });
        if (indexes.length == 0) {
            promise = promise.then(() => this.createAlbumPage());
        }
        else {
            let lastIndex = indexes.sort()[indexes.length - 1];
            for (let i = this.albumPageHtmls.length; i <= Math.floor(lastIndex / 20) + 1; i++) {
                promise = promise.then(() => this.createAlbumPage());
            }
        }
        return promise.then(() => super.parseAlbums(outputsParser, ...indexes));
    }
    parsePlaylists(outputsParser, ...indexes) {
        let promise = new Promise(resolve => {
            resolve();
        });
        if (indexes.length == 0) {
            promise = promise.then(() => this.createPlaylistPage());
        }
        else {
            let lastIndex = indexes.sort()[indexes.length - 1];
            for (let i = this.playlistPageHtmls.length; i <= Math.floor(lastIndex / 10) + 1; i++) {
                promise = promise.then(() => this.createPlaylistPage());
            }
        }
        return promise.then(() => super.parsePlaylists(outputsParser, ...indexes));
    }
    createSongPage() {
        return new Promise((resolve, reject) => {
            request.get("https://www.saavn.com/search/song/" + this.input.query
                + "?p=" + (this.songPageHtmls.length + 1), saavn_constants_1.default.REQUEST_OPTIONS)
                .then(html => {
                this.songPageHtmls.push(html);
                let $ = cheerio.load(html);
                $("span.title>a").each((index, element) => {
                    let songInput = new song_input_1.default();
                    songInput.url = $(element).attr("href");
                    this.input.songs.push(songInput);
                });
                resolve();
            })
                .catch(error => {
                reject(error);
            });
        });
    }
    createAlbumPage() {
        return new Promise((resolve, reject) => {
            request.get("https://www.saavn.com/search/album/" + this.input.query
                + "?p=" + (this.albumPageHtmls.length + 1), saavn_constants_1.default.REQUEST_OPTIONS)
                .then(html => {
                this.albumPageHtmls.push(html);
                let $ = cheerio.load(html);
                $("h3.title>a").each((index, element) => {
                    let albumInput = new album_input_1.default();
                    albumInput.url = $(element).attr("href");
                    this.input.albums.push(albumInput);
                });
                resolve();
            })
                .catch(error => {
                reject(error);
            });
        });
    }
    createPlaylistPage() {
        return new Promise((resolve, reject) => {
            request.get("https://www.saavn.com/search/playlist/" + this.input.query
                + "?p=" + (this.playlistPageHtmls.length + 1), saavn_constants_1.default.REQUEST_OPTIONS)
                .then(html => {
                this.playlistPageHtmls.push(html);
                let $ = cheerio.load(html);
                $("h3>a").each((index, element) => {
                    let playlistInput = new playlist_input_1.default();
                    playlistInput.url = $(element).attr("href");
                    this.input.playlists.push(playlistInput);
                });
                resolve();
            })
                .catch(error => {
                reject(error);
            });
        });
    }
}
exports.default = SaavnSearchParser;

//# sourceMappingURL=saavn_search_parser.js.map
