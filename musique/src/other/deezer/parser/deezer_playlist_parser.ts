import * as Promise from "bluebird";
import * as request from "request";
import * as cheerio from "cheerio";

import PlaylistParser from "../../../parser/playlist_parser";
import PlaylistContent from "../../../content/playlist_content";
import DeezerConstants from "../deezer_constants";
import SongInput from "../../../input/song_input";
import SongOutput from "../../../output/song_output";

export default class DeezerPlaylistParser extends PlaylistParser {
    protected createContent(): Promise<PlaylistContent> {
        return new Promise<PlaylistContent>((resolve, reject) => {
            request(this.input.url, DeezerConstants.REQUEST_OPTIONS, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }

                let content: PlaylistContent = new PlaylistContent();
                content.html = body;

                resolve(content);
            });
        });
    }

    protected contentCreated(): Promise<void> {
        return new Promise<void>(resolve => {
            let json: any = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)<\/script>/)![1]);

            let songInputs: SongInput[] = [];

            for (let i = 0; i < json.SONGS.data.length; i++) {
                let songInput: SongInput = new SongInput();
                songInput.url = "http://www.deezer.com/en/track/" + json.SONGS.data[i].SNG_ID;

                songInputs[i] = songInput;
            }

            this.input.songs = songInputs;

            resolve();
        });
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("h1#naboo_playlist_title").first().text().trim());
        });
    }

    protected createSongs(): Promise<SongOutput[]> {
        return new Promise<SongOutput[]>(resolve => {
            let json: any = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)<\/script>/)![1]);

            let songOutputs: SongOutput[] = this.output.songs;

            if (!songOutputs) {
                songOutputs = [];
            }

            for (let i = 0; i < json.SONGS.data.length; i++) {
                let songOutput: SongOutput = songOutputs[i];

                if (!songOutput) {
                    songOutput = new SongOutput();
                }

                songOutput.url = "http://www.deezer.com/en/track/" + json.SONGS.data[i].SNG_ID;
                songOutput.title = json.SONGS.data[i].SNG_TITLE;

                songOutputs[i] = songOutput;
            }

            resolve(songOutputs);
        });
    }
}
