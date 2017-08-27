"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request-promise");
const cheerio = require("cheerio");
const playlist_parser_1 = require("../../../parser/playlist_parser");
const playlist_content_1 = require("../../../content/playlist_content");
const deezer_constants_1 = require("../deezer_constants");
const song_input_1 = require("../../../input/song_input");
const song_output_1 = require("../../../output/song_output");
class DeezerPlaylistParser extends playlist_parser_1.default {
    createContent() {
        return new Promise((resolve, reject) => {
            request.get(this.input.url, deezer_constants_1.default.REQUEST_OPTIONS)
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
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)[1]);
            let songInputs = [];
            for (let i = 0; i < json.SONGS.data.length; i++) {
                let songInput = new song_input_1.default();
                songInput.url = "http://www.deezer.com/en/track/" + json.SONGS.data[i].SNG_ID;
                songInputs.push(songInput);
            }
            this.input.songs = songInputs;
            resolve();
        });
    }
    createTitle() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("h1#naboo_playlist_title").first().text().trim());
        });
    }
    createSongs() {
        return new Promise(resolve => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)[1]);
            let songOutputs = this.output.songs;
            if (!songOutputs) {
                songOutputs = [];
            }
            for (let i = 0; i < json.SONGS.data.length; i++) {
                let songOutput = songOutputs[i];
                if (!songOutput) {
                    songOutput = new song_output_1.default();
                }
                songOutput.url = "http://www.deezer.com/en/track/" + json.SONGS.data[i].SNG_ID;
                songOutput.title = json.SONGS.data[i].SNG_TITLE;
                songOutputs[i] = songOutput;
            }
            resolve(songOutputs);
        });
    }
}
exports.default = DeezerPlaylistParser;

//# sourceMappingURL=deezer_playlist_parser.js.map
