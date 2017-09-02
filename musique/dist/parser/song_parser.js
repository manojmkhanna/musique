"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const base_parser_1 = require("./base_parser");
const song_input_1 = require("../input/song_input");
const song_output_1 = require("../output/song_output");
const song_content_1 = require("../content/song_content");
class SongParser extends base_parser_1.default {
    createInput() {
        return new Promise(resolve => {
            resolve(new song_input_1.default());
        });
    }
    createOutput() {
        return new Promise(resolve => {
            resolve(new song_output_1.default());
        });
    }
    createContent() {
        return new Promise(resolve => {
            resolve(new song_content_1.default());
        });
    }
    parse() {
        return super.parse()
            .then(() => this.parseDuration())
            .then(() => this.parseGenre())
            .then(() => this.parseLyrics())
            .then(() => this.parseMp3())
            .then(() => this.parseTitle())
            .then(() => this.parseTrack())
            .then(() => this.parseAlbum())
            .then(() => this.parseArtists());
    }
    createDuration() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createGenre() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createLyrics() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createMp3() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createTitle() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createTrack() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createFile(progressCallback) {
        return new Promise(resolve => {
            resolve();
        });
    }
    createAlbum() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createArtists() {
        return new Promise(resolve => {
            resolve();
        });
    }
    parseDuration() {
        return this.parseValue("duration", () => this.createDuration());
    }
    parseGenre() {
        return this.parseValue("genre", () => this.createGenre());
    }
    parseLyrics() {
        return this.parseValue("lyrics", () => this.createLyrics());
    }
    parseMp3() {
        return this.parseValue("mp3", () => this.createMp3());
    }
    parseTitle() {
        return this.parseValue("title", () => this.createTitle());
    }
    parseTrack() {
        return this.parseValue("track", () => this.createTrack());
    }
    parseFile(progressCallback) {
        return this.parseValue("file", () => this.createFile(progressCallback));
    }
    parseAlbum(outputParser) {
        if (outputParser == undefined) {
            return this.parseValue("album", () => this.createAlbum());
        }
        else {
            return this.parseOutput("album", () => new Promise(resolve => {
                resolve(this.platform.createAlbumParser());
            }), outputParser);
        }
    }
    parseArtists(outputsParser, ...indexes) {
        if (outputsParser == undefined) {
            return this.parseValue("artists", () => this.createArtists());
        }
        else {
            return this.parseOutputs("artists", () => new Promise(resolve => {
                resolve(this.platform.createArtistParser());
            }), outputsParser, ...indexes);
        }
    }
}
exports.default = SongParser;

//# sourceMappingURL=song_parser.js.map
