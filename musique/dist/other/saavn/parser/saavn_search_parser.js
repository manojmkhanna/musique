"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const request = require("request-promise");
const search_parser_1 = require("../../../parser/search_parser");
const search_content_1 = require("../../../content/search_content");
class SaavnSearchParser extends search_parser_1.default {
    createContent() {
        return new Promise((resolve, reject) => {
            request.get("https://www.saavn.com/search/" + this.input.query, {
                headers: {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "en,en-US;q=0.8",
                    "Cache-Control": "max-age=0",
                    "Connection": "keep-alive",
                    "DNT": "1",
                    "Host": "www.saavn.com",
                    "Upgrade-Insecure-Requests": "1",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36"
                },
                gzip: true
            })
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
