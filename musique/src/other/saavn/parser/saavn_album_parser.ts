import * as Promise from "bluebird";
import * as request from "request-promise";
import * as cheerio from "cheerio";

import AlbumParser from "../../../parser/album_parser";
import AlbumContent from "../../../content/album_content";
import ArtistInput from "../../../input/artist_input";
import SongInput from "../../../input/song_input";
import ArtistOutput from "../../../output/artist_output";
import SongOutput from "../../../output/song_output";

export default class SaavnAlbumParser extends AlbumParser {
    protected createContent(): Promise<AlbumContent> {
        return new Promise<AlbumContent>((resolve, reject) => {
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
                    let content = new AlbumContent();
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

            let artistInputs: ArtistInput[] = [];

            $("h2.page-subtitle>a").each((index, element) => {
                let artistInput = new ArtistInput();
                artistInput.url = $(element).attr("href").replace("albums", "artist");

                artistInputs[index] = artistInput;
            });

            this.input.artists = artistInputs;

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

    protected createArt(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("div.art>img").first().attr("src"));
        });
    }

    protected createDuration(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("h2.page-subtitle").first().text().match(/ · .+ · (.+)$/)![1]);
        });
    }

    protected createLabel(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("p.copyright>a").last().text());
        });
    }

    protected createLanguage(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("div.header-context>a").first().text());
        });
    }

    protected createReleased(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("p.copyright").first().text().match(/Released (.+)©/)![1].replace(",", ""));
        });
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("h1.page-title").first().text());
        });
    }

    protected createArtists(): Promise<ArtistOutput[]> {
        return new Promise<ArtistOutput[]>(resolve => {
            let $ = cheerio.load(this.content.html);

            let artistOutputs: ArtistOutput[] = this.output.artists;

            if (!artistOutputs) {
                artistOutputs = [];
            }

            $("h2.page-subtitle>a").each((index, element) => {
                let artistOutput = artistOutputs[index];

                if (!artistOutput) {
                    artistOutput = new ArtistOutput();
                }

                artistOutput.url = $(element).attr("href").replace("albums", "artist");
                artistOutput.title = $(element).text();

                artistOutputs[index] = artistOutput;
            });

            resolve(artistOutputs);
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
