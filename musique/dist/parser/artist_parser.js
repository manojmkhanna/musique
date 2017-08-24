"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const base_parser_1 = require("./base_parser");
const artist_input_1 = require("../input/artist_input");
const artist_output_1 = require("../output/artist_output");
const artist_content_1 = require("../content/artist_content");
class ArtistParser extends base_parser_1.default {
    createInput() {
        return new Promise(resolve => {
            resolve(new artist_input_1.default());
        });
    }
    createOutput() {
        return new Promise(resolve => {
            resolve(new artist_output_1.default());
        });
    }
    createContent() {
        return new Promise(resolve => {
            resolve(new artist_content_1.default());
        });
    }
    parse() {
        return super.parse()
            .then(() => this.parseTitle())
            .then(() => this.parseAlbums())
            .then(() => this.parseSongs());
    }
    createTitle() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createAlbums() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createSongs() {
        return new Promise(resolve => {
            resolve();
        });
    }
    parseTitle() {
        return this.parseValue("title", () => this.createTitle());
    }
    parseAlbums(outputsParser, ...indexes) {
        if (outputsParser == undefined) {
            return this.parseValue("albums", () => this.createAlbums());
        }
        else {
            return this.parseOutputs("albums", () => new Promise(resolve => {
                resolve(this.platform.createAlbumParser());
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
exports.default = ArtistParser;

//# sourceMappingURL=artist_parser.js.map
