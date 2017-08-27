"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const platform_1 = require("../../platform/platform");
const deezer_song_parser_1 = require("./parser/deezer_song_parser");
const deezer_album_parser_1 = require("./parser/deezer_album_parser");
class DeezerPlatform extends platform_1.default {
    createSongParser() {
        return new deezer_song_parser_1.default(this);
    }
    createAlbumParser() {
        return new deezer_album_parser_1.default(this);
    }
}
exports.default = DeezerPlatform;

//# sourceMappingURL=deezer_platform.js.map
