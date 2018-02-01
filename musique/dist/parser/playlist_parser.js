"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const base_parser_1 = require("./base_parser");
const playlist_input_1 = require("../input/playlist_input");
const playlist_output_1 = require("../output/playlist_output");
const playlist_content_1 = require("../content/playlist_content");
class PlaylistParser extends base_parser_1.default {
    createInput() {
        return new Promise(resolve => {
            resolve(new playlist_input_1.default());
        });
    }
    createOutput() {
        return new Promise(resolve => {
            resolve(new playlist_output_1.default());
        });
    }
    createContent() {
        return new Promise(resolve => {
            resolve(new playlist_content_1.default());
        });
    }
    parse() {
        return super.parse()
            .then(() => this.parseTitle())
            .then(() => this.parseSongs());
    }
    createTitle() {
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
    parseSongs(outputsParser, ...indexes) {
        if (!outputsParser) {
            return this.parseValue("songs", () => this.createSongs());
        }
        else {
            return this.parseOutputs("songs", () => new Promise(resolve => {
                resolve(this.platform.createSongParser());
            }), outputsParser, ...indexes);
        }
    }
}
exports.default = PlaylistParser;

//# sourceMappingURL=playlist_parser.js.map
