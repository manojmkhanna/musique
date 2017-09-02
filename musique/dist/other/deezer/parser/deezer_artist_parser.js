"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const rp = require("request-promise");
const cheerio = require("cheerio");
const artist_parser_1 = require("../../../parser/artist_parser");
const artist_content_1 = require("../../../content/artist_content");
const deezer_constants_1 = require("../deezer_constants");
class DeezerArtistParser extends artist_parser_1.default {
    createContent() {
        return new Promise((resolve, reject) => {
            rp.get(this.input.url, deezer_constants_1.default.REQUEST_OPTIONS)
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
            resolve($("h1#naboo_artist_name").first().text().trim());
        });
    }
}
exports.default = DeezerArtistParser;

//# sourceMappingURL=deezer_artist_parser.js.map
