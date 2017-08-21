"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const platform_1 = require("../../platform/platform");
const saavn_song_parser_1 = require("./parser/saavn_song_parser");
const saavn_album_parser_1 = require("./parser/saavn_album_parser");
const saavn_artist_parser_1 = require("./parser/saavn_artist_parser");
const saavn_playlist_parser_1 = require("./parser/saavn_playlist_parser");
const saavn_search_parser_1 = require("./parser/saavn_search_parser");
class SaavnPlatform extends platform_1.default {
    constructor(name) {
        super(name);
        this.name = name;
    }
    createSongParser() {
        return new saavn_song_parser_1.default(this);
    }
    createAlbumParser() {
        return new saavn_album_parser_1.default(this);
    }
    createArtistParser() {
        return new saavn_artist_parser_1.default(this);
    }
    createPlaylistParser() {
        return new saavn_playlist_parser_1.default(this);
    }
    createSearchParser() {
        return new saavn_search_parser_1.default(this);
    }
}
exports.default = SaavnPlatform;

//# sourceMappingURL=saavn_platform.js.map
