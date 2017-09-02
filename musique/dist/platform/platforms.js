"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deezer_platform_1 = require("../other/deezer/deezer_platform");
const saavn_platform_1 = require("../other/saavn/saavn_platform");
class Platforms {
    constructor() {
        this.deezer = new deezer_platform_1.default();
        this.saavn = new saavn_platform_1.default();
    }
}
exports.default = Platforms;

//# sourceMappingURL=platforms.js.map
