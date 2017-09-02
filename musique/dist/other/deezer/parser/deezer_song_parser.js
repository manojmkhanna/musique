"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const rp = require("request-promise");
const cheerio = require("cheerio");
const crypto = require("crypto");
const request = require("request");
const song_parser_1 = require("../../../parser/song_parser");
const song_content_1 = require("../../../content/song_content");
const deezer_constants_1 = require("../deezer_constants");
const album_input_1 = require("../../../input/album_input");
const artist_input_1 = require("../../../input/artist_input");
const album_output_1 = require("../../../output/album_output");
const artist_output_1 = require("../../../output/artist_output");
const progress = require("request-progress");
class DeezerSongParser extends song_parser_1.default {
    createContent() {
        return new Promise((resolve, reject) => {
            rp.get(this.input.url, deezer_constants_1.default.REQUEST_OPTIONS)
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
            for (let i = 0; i < json.DATA.ARTISTS.length; i++) {
                let artistInput = new artist_input_1.default();
                artistInput.url = "http://www.deezer.com/en/artist/" + json.DATA.ARTISTS[i].ART_ID;
                artistInputs[i] = artistInput;
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
            let hash = json.DATA.MD5_ORIGIN + "¤3¤" + json.DATA.SNG_ID + "¤" + json.DATA.MEDIA_VERSION;
            let hashMd5 = crypto.createHash("md5").update(new Buffer(hash, "binary")).digest("hex");
            hash = hashMd5 + "¤" + hash + "¤";
            let cipher = crypto.createCipheriv("aes-128-ecb", "jo6aey6haid2Teih", "");
            resolve("http://e-cdn-proxy-" + json.DATA.MD5_ORIGIN.substr(0, 1)
                + ".deezer.com/mobile/1/" + cipher.update(hash, "binary", "hex") + cipher.final("hex"));
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
    createFile(progressCallback) {
        return new Promise((resolve, reject) => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)[1]);
            let hash = json.DATA.MD5_ORIGIN + "¤3¤" + json.DATA.SNG_ID + "¤" + json.DATA.MEDIA_VERSION;
            let hashMd5 = crypto.createHash("md5").update(new Buffer(hash, "binary")).digest("hex");
            hash = hashMd5 + "¤" + hash + "¤";
            let cipher = crypto.createCipheriv("aes-128-ecb", "jo6aey6haid2Teih", "");
            let mp3 = "http://e-cdn-proxy-" + json.DATA.MD5_ORIGIN.substr(0, 1)
                + ".deezer.com/mobile/1/" + cipher.update(hash, "binary", "hex") + cipher.final("hex");
            progress(request(mp3, {
                encoding: null
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                let keyMd5 = crypto.createHash("md5").update(json.DATA.SNG_ID).digest("hex");
                let key = "";
                for (let i = 0; i < 16; i++) {
                    key += String.fromCharCode(keyMd5.charCodeAt(i)
                        ^ keyMd5.charCodeAt(i + 16) ^ "g4el58wc0zvf9na1".charCodeAt(i));
                }
                for (let i = 0; i * 2048 < body.length; i++) {
                    if (i % 3 == 0) {
                        let cipher = crypto.createDecipheriv("bf-cbc", key, "\x00\x01\x02\x03\x04\x05\x06\x07");
                        cipher.setAutoPadding(false);
                        let buffer = Buffer.alloc(2048);
                        body.copy(buffer, 0, i * 2048, i * 2048 + 2048);
                        buffer = Buffer.concat([cipher.update(buffer), cipher.final()]);
                        buffer.copy(body, i * 2048, 0, buffer.length);
                    }
                }
                resolve(body);
            }), {
                throttle: 33
            })
                .on("progress", (state) => {
                progressCallback(state);
            });
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
}
exports.default = DeezerSongParser;

//# sourceMappingURL=deezer_song_parser.js.map
