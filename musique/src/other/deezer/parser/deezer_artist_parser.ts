import * as Promise from "bluebird";
import * as rp from "request-promise";
import * as cheerio from "cheerio";

import ArtistParser from "../../../parser/artist_parser";
import ArtistContent from "../../../content/artist_content";
import DeezerConstants from "../deezer_constants";

export default class DeezerArtistParser extends ArtistParser {
    protected createContent(): Promise<ArtistContent> {
        return new Promise<ArtistContent>((resolve, reject) => {
            rp.get(this.input.url, DeezerConstants.REQUEST_OPTIONS)
                .then(html => {
                    let content = new ArtistContent();
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
            this.input.albums = [];
            this.input.songs = [];

            resolve();
        });
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("h1#naboo_artist_name").first().text().trim());
        });
    }
}
