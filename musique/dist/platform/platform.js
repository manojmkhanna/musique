"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const song_parser_1 = require("../parser/song_parser");
const album_parser_1 = require("../parser/album_parser");
const artist_parser_1 = require("../parser/artist_parser");
const playlist_parser_1 = require("../parser/playlist_parser");
const search_parser_1 = require("../parser/search_parser");
class Platform {
    constructor(platformName) {
        this.platformName = platformName;
    }
    createSongParser() {
        return new song_parser_1.default(this);
    }
    createAlbumParser() {
        return new album_parser_1.default(this);
    }
    createArtistParser() {
        return new artist_parser_1.default(this);
    }
    createPlaylistParser() {
        return new playlist_parser_1.default(this);
    }
    createSearchParser() {
        return new search_parser_1.default(this);
    }
}
exports.default = Platform;

//# sourceMappingURL=platform.js.map
