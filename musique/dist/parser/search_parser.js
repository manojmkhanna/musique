"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parsque_1 = require("parsque");
const Promise = require("bluebird");
const search_input_1 = require("../input/search_input");
const search_output_1 = require("../output/search_output");
const search_content_1 = require("../content/search_content");
class SearchParser extends parsque_1.Parser {
    constructor(platform) {
        super();
        this.platform = platform;
    }
    createInput() {
        return new Promise(resolve => {
            resolve(new search_input_1.default());
        });
    }
    createOutput() {
        return new Promise(resolve => {
            resolve(new search_output_1.default());
        });
    }
    createContent() {
        return new Promise(resolve => {
            resolve(new search_content_1.default());
        });
    }
    parse() {
        return this.parseSongs()
            .then(() => this.parseAlbums())
            .then(() => this.parseArtists())
            .then(() => this.parsePlaylists());
    }
    createSongs() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createAlbums() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createArtists() {
        return new Promise(resolve => {
            resolve();
        });
    }
    createPlaylists() {
        return new Promise(resolve => {
            resolve();
        });
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
    parsePlaylists(outputsParser, ...indexes) {
        if (outputsParser == undefined) {
            return this.parseValue("playlists", () => this.createPlaylists());
        }
        else {
            return this.parseOutputs("playlists", () => new Promise(resolve => {
                resolve(this.platform.createPlaylistParser());
            }), outputsParser, ...indexes);
        }
    }
}
exports.default = SearchParser;

//# sourceMappingURL=search_parser.js.map
