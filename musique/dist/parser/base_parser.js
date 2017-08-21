"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parsque_1 = require("parsque");
const Promise = require("bluebird");
class BaseParser extends parsque_1.Parser {
    constructor(platform) {
        super();
        this.platform = platform;
    }
    parse() {
        return this.parseUrl();
    }
    createUrl() {
        return new Promise(resolve => {
            resolve(this.input.url);
        });
    }
    parseUrl() {
        return this.parseValue("url", () => this.createUrl());
    }
}
exports.default = BaseParser;

//# sourceMappingURL=base_parser.js.map
