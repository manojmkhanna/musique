import * as Promise from "bluebird";
import * as request from "request-promise";
import * as cheerio from "cheerio";

import PlaylistParser from "../../../parser/playlist_parser";
import PlaylistContent from "../../../content/playlist_content";
import SongInput from "../../../input/song_input";
import SongOutput from "../../../output/song_output";

export default class SaavnPlaylistParser extends PlaylistParser {
    protected createContent(): Promise<PlaylistContent> {
        return new Promise<PlaylistContent>((resolve, reject) => {
            request.get(this.input.url, {
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
                    let content = new PlaylistContent();
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
            let $ = cheerio.load(this.content.html);

            let songInputs: SongInput[] = [];

            $("span.title>a").each((index, element) => {
                let songInput = new SongInput();
                songInput.url = $(element).attr("href");

                songInputs[index] = songInput;
            });

            this.input.songs = songInputs;

            resolve();
        });
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("h1.page-title").first().text());
        });
    }

    protected createSongs(): Promise<SongOutput[]> {
        return new Promise<SongOutput[]>(resolve => {
            let $ = cheerio.load(this.content.html);

            let songOutputs: SongOutput[] = this.output.songs;

            if (!songOutputs) {
                songOutputs = [];
            }

            $("span.title>a").each((index, element) => {
                let songOutput = songOutputs[index];

                if (!songOutput) {
                    songOutput = new SongOutput();
                }

                songOutput.url = $(element).attr("href");
                songOutput.title = $(element).text();

                songOutputs[index] = songOutput;
            });

            resolve(songOutputs);
        });
    }
}
