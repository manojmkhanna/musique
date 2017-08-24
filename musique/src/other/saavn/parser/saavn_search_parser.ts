import * as Promise from "bluebird";
import * as request from "request-promise";

import SearchParser from "../../../parser/search_parser";
import SearchContent from "../../../content/search_content";
import SaavnConstants from "../saavn_constants";

export default class SaavnSearchParser extends SearchParser {
    protected createContent(): Promise<SearchContent> {
        return new Promise<SearchContent>((resolve, reject) => {
            request.get("https://www.saavn.com/search/" + this.input.query, SaavnConstants.REQUEST_OPTIONS)
                .then(html => {
                    let content = new SearchContent();
                    content.html = html;

                    resolve(content);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}
