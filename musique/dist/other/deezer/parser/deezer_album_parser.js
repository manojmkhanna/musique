"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request-promise");
const cheerio = require("cheerio");
const moment = require("moment");
const album_parser_1 = require("../../../parser/album_parser");
const album_content_1 = require("../../../content/album_content");
const deezer_constants_1 = require("../deezer_constants");
const artist_input_1 = require("../../../input/artist_input");
const song_input_1 = require("../../../input/song_input");
const artist_output_1 = require("../../../output/artist_output");
const song_output_1 = require("../../../output/song_output");
class DeezerAlbumParser extends album_parser_1.default {
    createContent() {
        return new Promise((resolve, reject) => {
            request.get(this.input.url, deezer_constants_1.default.REQUEST_OPTIONS)
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
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)[1]);
            let artistInputs = [];
            for (let i = 0; i < json.DATA.ARTISTS.length; i++) {
                let artistInput = new artist_input_1.default();
                artistInput.url = "http://www.deezer.com/en/artist/" + json.DATA.ARTISTS[i].ART_ID;
                artistInputs[i] = artistInput;
            }
            this.input.artists = artistInputs;
            let songInputs = [];
            for (let i = 0; i < json.SONGS.data.length; i++) {
                let songInput = new song_input_1.default();
                songInput.url = "http://www.deezer.com/en/track/" + json.SONGS.data[i].SNG_ID;
                songInputs[i] = songInput;
            }
            this.input.songs = songInputs;
            resolve();
        });
    }
    createArt() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("img#naboo_album_image").first().attr("src").replace("200x200", "512x512"));
        });
    }
    createDate() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve(moment($("span#naboo_album_head_style")
                .first().text().match(/\| (.+?)\t+/)[1], "DD-MM-YYYY").format("YYYY-MM-DD"));
        });
    }
    createLabel() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("div.naboo-album-label").first().text().match(/\| \t+(.+?)\t+/)[1]);
        });
    }
    createLanguage() {
        return new Promise(resolve => {
            resolve("English");
        });
    }
    createTitle() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("h1#naboo_album_title").first().text().trim());
        });
    }
    createYear() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("div.naboo-album-label").first().text().match(/\t+(\d+?) \|/)[1]);
        });
    }
    createArtists() {
        return new Promise(resolve => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)[1]);
            let artistOutputs = this.output.artists;
            if (!artistOutputs) {
                artistOutputs = [];
            }
            for (let i = 0; i < json.DATA.ARTISTS.length; i++) {
                let artistOutput = artistOutputs[i];
                if (!artistOutput) {
                    artistOutput = new artist_output_1.default();
                }
                artistOutput.url = "http://www.deezer.com/en/artist/" + json.DATA.ARTISTS[i].ART_ID;
                artistOutput.title = json.DATA.ARTISTS[i].ART_NAME;
                artistOutputs[i] = artistOutput;
            }
            resolve(artistOutputs);
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
exports.default = DeezerAlbumParser;

//# sourceMappingURL=deezer_album_parser.js.map
