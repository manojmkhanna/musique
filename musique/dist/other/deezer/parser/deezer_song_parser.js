"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request-promise");
const cheerio = require("cheerio");
const crypto = require("crypto");
const song_parser_1 = require("../../../parser/song_parser");
const song_content_1 = require("../../../content/song_content");
const deezer_constants_1 = require("../deezer_constants");
const album_input_1 = require("../../../input/album_input");
const artist_input_1 = require("../../../input/artist_input");
const album_output_1 = require("../../../output/album_output");
const artist_output_1 = require("../../../output/artist_output");
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
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)[1]);
            let albumInput = new album_input_1.default();
            albumInput.url = "http://www.deezer.com/en/album/" + json.DATA.ALB_ID;
            this.input.album = albumInput;
            let artistInputs = [];
            for (let i = 1; i < json.DATA.ARTISTS.length; i++) {
                let artistInput = new artist_input_1.default();
                artistInput.url = "http://www.deezer.com/en/artist/" + json.DATA.ARTISTS[i].ART_ID;
                artistInputs.push(artistInput);
            }
            this.input.artists = artistInputs;
            resolve();
        });
    }
    createDuration() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("div.naboo_track_song").last().text().match(/Length : 0*(\d+:\d+)/)[1]);
        });
    }
    createLyrics() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("div:contains(Lyrics)+div").first().text());
        });
    }
    createMp3() {
        return new Promise(resolve => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)[1]);
            let mp3 = json.DATA.MD5_ORIGIN + "¤3¤" + json.DATA.SNG_ID + "¤" + json.DATA.MEDIA_VERSION;
            mp3 = crypto.createHash("md5").update(mp3, "ascii").digest("hex") + "¤" + mp3 + "¤";
            while (mp3.length % 16 > 0) {
                mp3 += " ";
            }
            mp3 = "http://e-cdn-proxy-0.deezer.com/mobile/1/"
                + crypto.createCipheriv("aes-128-ecb", "jo6aey6haid2Teih", "").update(mp3, "ascii", "hex");
            resolve(mp3);
        });
    }
    createTitle() {
        return new Promise(resolve => {
            let $ = cheerio.load(this.content.html);
            resolve($("h1#naboo_track_title").first().text().trim());
        });
    }
    createTrack() {
        return new Promise(resolve => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)[1]);
            resolve(json.DATA.TRACK_NUMBER);
        });
    }
    createAlbum() {
        return new Promise(resolve => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)[1]);
            let albumOutput = this.output.album;
            if (!albumOutput) {
                albumOutput = new album_output_1.default();
            }
            albumOutput.url = "http://www.deezer.com/en/album/" + json.DATA.ALB_ID;
            albumOutput.title = json.DATA.ALB_TITLE;
            resolve(albumOutput);
        });
    }
    createArtists() {
        return new Promise(resolve => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)[1]);
            let artistOutputs = this.output.artists;
            if (!artistOutputs) {
                artistOutputs = [];
            }
            for (let i = 1; i < json.DATA.ARTISTS.length; i++) {
                let artistOutput = artistOutputs[i];
                if (!artistOutput) {
                    artistOutput = new artist_output_1.default();
                }
                artistOutput.url = "http://www.deezer.com/en/artist/" + json.DATA.ARTISTS[i].ART_ID;
                artistOutput.title = json.DATA.ARTISTS[i].ART_NAME;
                artistOutputs[i - 1] = artistOutput;
            }
            resolve(artistOutputs);
        });
    }
}
exports.default = DeezerSongParser;

//# sourceMappingURL=deezer_song_parser.js.map
