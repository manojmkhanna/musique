"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const base_parser_1 = require("./base_parser");
const album_input_1 = require("../input/album_input");
const album_output_1 = require("../output/album_output");
const album_content_1 = require("../content/album_content");
class AlbumParser extends base_parser_1.default {
    createInput() {
        return new Promise(resolve => {
            resolve(new album_input_1.default());
        });
    }
    createOutput() {
        return new Promise(resolve => {
            resolve(new album_output_1.default());
        });
    }
    createContent() {
        return new Promise(resolve => {
            resolve(new album_content_1.default());
        });
    }
    parse() {
        return super.parse()
            .then(() => this.parseArt())
            .then(() => this.parseDuration())
            .then(() => this.parseLabel())
            .then(() => this.parseLanguage())
            .then(() => this.parseReleased())
            .then(() => this.parseTitle())
            .then(() => this.parseArtists())
            .then(() => this.parseSongs());
    }
    createArt() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createDuration() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createLabel() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createLanguage() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createReleased() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createTitle() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createArtists() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createSongs() {
        return new Promise(resolve => {
            resolve();
        });
    }
    parseArt() {
        return this.parseValue("art", () => this.createArt());
    }
    parseDuration() {
        return this.parseValue("duration", () => this.createDuration());
    }
    parseLabel() {
        return this.parseValue("label", () => this.createLabel());
    }
    parseLanguage() {
        return this.parseValue("language", () => this.createLanguage());
    }
    parseReleased() {
        return this.parseValue("released", () => this.createReleased());
    }
    parseTitle() {
        return this.parseValue("title", () => this.createTitle());
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
    parseSongs(outputsParser, ...indexes) {
        if (outputsParser == undefined) {
            return this.parseValue("songs", () => this.createSongs());
        }
        else {
            return this.parseOutputs("songs", () => new Promise(resolve => {
                resolve(this.platform.createSongParser());
            }), outputsParser, ...indexes);
        }
    }
}
exports.default = AlbumParser;

//# sourceMappingURL=album_parser.js.map
