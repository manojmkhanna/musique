"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request");
const cheerio = require("cheerio");
const artist_parser_1 = require("../../../parser/artist_parser");
const artist_content_1 = require("../../../content/artist_content");
const deezer_constants_1 = require("../deezer_constants");
class DeezerArtistParser extends artist_parser_1.default {
    createContent() {
        return new Promise((resolve, reject) => {
            request(this.input.url, deezer_constants_1.default.REQUEST_OPTIONS, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                let content = new artist_content_1.default();
                content.html = body;
                resolve(content);
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
            resolve($("h1#naboo_artist_name").first().text().trim());
        });
    }
    createPlaylists() {
        return super.createPlaylists(); //TODO
    }
}
exports.default = DeezerArtistParser;

//# sourceMappingURL=deezer_artist_parser.js.map
