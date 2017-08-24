"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request-promise");
const search_parser_1 = require("../../../parser/search_parser");
const search_content_1 = require("../../../content/search_content");
const saavn_constants_1 = require("../saavn_constants");
class SaavnSearchParser extends search_parser_1.default {
    createContent() {
        return new Promise((resolve, reject) => {
            request.get("https://www.saavn.com/search/" + this.input.query, saavn_constants_1.default.REQUEST_OPTIONS)
                .then(html => {
                let content = new search_content_1.default();
                content.html = html;
                resolve(content);
            })
                .catch(error => {
                reject(error);
            });
        });
    }
}
exports.default = SaavnSearchParser;

//# sourceMappingURL=saavn_search_parser.js.map
