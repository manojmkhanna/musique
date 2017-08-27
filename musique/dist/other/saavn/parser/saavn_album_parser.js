"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request-promise");
const cheerio = require("cheerio");
const album_parser_1 = require("../../../parser/album_parser");
const album_content_1 = require("../../../content/album_content");
const saavn_constants_1 = require("../saavn_constants");
const artist_input_1 = require("../../../input/artist_input");
const song_input_1 = require("../../../input/song_input");
const artist_output_1 = require("../../../output/artist_output");
const song_output_1 = require("../../../output/song_output");
class SaavnAlbumParser extends album_parser_1.default {
    createContent() {
        return new Promise((resolve, reject) => {
            request.get(this.input.url, saavn_constants_1.default.REQUEST_OPTIONS)
                .then(html => {
                let content = new album_content_1.default();
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
            let artistInputs = [];
            $("h2.page-subtitle>a").each((index, element) => {
                let artistInput = new artist_input_1.default();
                artistInput.url = $(element).attr("href").replace("-albums", "-artist");
                artistInputs[index] = artistInput;
            });
            this.input.artists = artistInputs;
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
    createArt() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("div.art>img").first().attr("src"));
        });
    }
    createLabel() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("p.copyright>a").last().text());
        });
    }
    createLanguage() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("div.header-context>a").first().text());
        });
    }
    createReleased() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("p.copyright").first().text().match(/Released (.+)©/)[1].replace(",", ""));
        });
    }
    createTitle() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("h1.page-title").first().text());
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
                let artistOutput = artistOutputs[index];
                if (!artistOutput) {
                    artistOutput = new artist_output_1.default();
                }
                artistOutput.url = $(element).attr("href").replace("-albums", "-artist");
                artistOutput.title = $(element).text();
                artistOutputs[index] = artistOutput;
            });
            resolve(artistOutputs);
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
exports.default = SaavnAlbumParser;

//# sourceMappingURL=saavn_album_parser.js.map
