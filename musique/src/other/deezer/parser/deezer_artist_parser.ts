import * as Promise from "bluebird";
import * as request from "request";
import * as cheerio from "cheerio";

import ArtistParser from "../../../parser/artist_parser";
import ArtistContent from "../../../content/artist_content";
import DeezerConstants from "../deezer_constants";
import PlaylistOutput from "../../../output/playlist_output";

export default class DeezerArtistParser extends ArtistParser {
    protected createContent(): Promise<ArtistContent> {
        return new Promise<ArtistContent>((resolve, reject) => {
            request(this.input.url, DeezerConstants.REQUEST_OPTIONS, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }

                let content = new ArtistContent();
                content.html = body;

                resolve(content);
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

    protected createPlaylists(): Promise<PlaylistOutput[]> {
        return super.createPlaylists(); //TODO
    }
}
