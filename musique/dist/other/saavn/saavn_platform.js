"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const platform_1 = require("../../platform/platform");
const saavn_song_parser_1 = require("./parser/saavn_song_parser");
class SaavnPlatform extends platform_1.default {
    createSongParser() {
        return new saavn_song_parser_1.default(this);
    }
}
exports.default = SaavnPlatform;

//# sourceMappingURL=saavn_platform.js.map
