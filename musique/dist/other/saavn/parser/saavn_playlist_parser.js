"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request-promise");
const cheerio = require("cheerio");
const playlist_parser_1 = require("../../../parser/playlist_parser");
const playlist_content_1 = require("../../../content/playlist_content");
const saavn_constants_1 = require("../saavn_constants");
const song_input_1 = require("../../../input/song_input");
const song_output_1 = require("../../../output/song_output");
class SaavnPlaylistParser extends playlist_parser_1.default {
    createContent() {
        return new Promise((resolve, reject) => {
            request.get(this.input.url, saavn_constants_1.default.REQUEST_OPTIONS)
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
