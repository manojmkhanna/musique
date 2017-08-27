import * as Promise from "bluebird";
import * as request from "request-promise";
// import * as cheerio from "cheerio";

import SongParser from "../../../parser/song_parser";
import SongContent from "../../../content/song_content";
import DeezerConstants from "../deezer_constants";

export default class DeezerSongParser extends SongParser {
    protected createContent(): Promise<SongContent> {
        return new Promise<SongContent>((resolve, reject) => {
            request.get(this.input.url, DeezerConstants.REQUEST_OPTIONS)
                .then(html => {
                    let content = new SongContent();
                    content.html = html;

                    resolve(content);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    protected contentCreated(): Promise<void> {
        return new Promise<void>(resolve => {
            console.log(JSON.stringify(JSON.parse(this.content.html.match(/track: ({.+}),/)![1]), null, 2));

            resolve();
        });
    }
}
