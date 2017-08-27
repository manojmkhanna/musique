"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request-promise");
// import * as cheerio from "cheerio";
const song_parser_1 = require("../../../parser/song_parser");
const song_content_1 = require("../../../content/song_content");
const deezer_constants_1 = require("../deezer_constants");
class DeezerSongParser extends song_parser_1.default {
    createContent() {
        return new Promise((resolve, reject) => {
            request.get(this.input.url, deezer_constants_1.default.REQUEST_OPTIONS)
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
            console.log(JSON.stringify(JSON.parse(this.content.html.match(/track: ({.+}),/)[1]), null, 2));
            resolve();
        });
    }
}
exports.default = DeezerSongParser;

//# sourceMappingURL=deezer_song_parser.js.map
