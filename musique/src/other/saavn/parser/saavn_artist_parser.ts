import * as Promise from "bluebird";
import * as request from "request-promise";
import * as cheerio from "cheerio";

import ArtistParser from "../../../parser/artist_parser";
import ArtistContent from "../../../content/artist_content";
// import AlbumOutput from "../../../output/album_output";
// import SongOutput from "../../../output/song_output";
// import AlbumParser from "../../../parser/album_parser";
// import SongParser from "../../../parser/song_parser";

export default class SaavnArtistParser extends ArtistParser {
    // private albumPageIndex: number;
    // private albumPageHtml: string[];
    // private songPageIndex: number;
    // private songPageHtml: string[];

    protected createContent(): Promise<ArtistContent> {
        return new Promise<ArtistContent>((resolve, reject) => {
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

            resolve($("h1.page-title").first().text());
        });
    }

    // protected createAlbums(): Promise<AlbumOutput[]> {
    //
    // }
    //
    // protected createSongs(): Promise<SongOutput[]> {
    //
    // }
    //
    // public parseAlbums(outputsParser?: (childParser: AlbumParser, index: number) => Promise<any>,
    //                    ...indexes: number[]): Promise<this> {
    //     let promise = new Promise<any>(resolve => {
    //         resolve();
    //     });
    //
    //     if (indexes.length == 0) {
    //         promise = promise.then(() => this.parseAlbumPage());
    //     } else {
    //         let lastIndex = indexes.sort()[indexes.length - 1];
    //
    //         while (lastIndex > this.albumPageHtml.length - 1) {
    //             promise = promise.then(() => this.parseAlbumPage());
    //         }
    //     }
    // }
    //
    // public parseSongs(outputsParser?: (childParser: SongParser, index: number) => Promise<any>,
    //                   ...indexes: number[]): Promise<this> {
    //
    // }
    //
    // private parseAlbumPage(): Promise<void> {
    //     return request.get(this.input.url, {
    //         headers: {
    //             "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    //             "Accept-Encoding": "gzip, deflate, br",
    //             "Accept-Language": "en,en-US;q=0.8",
    //             "Cache-Control": "max-age=0",
    //             "Connection": "keep-alive",
    //             "DNT": "1",
    //             "Host": "www.saavn.com",
    //             "Upgrade-Insecure-Requests": "1",
    //             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36"
    //         },
    //         gzip: true
    //     })
    //         .then(html => {
    //             let content = new ArtistContent();
    //             content.html = html;
    //
    //             // resolve(content);
    //         })
    //         .catch(error => {
    //             // reject(error);
    //         });
    // }
    //
    // private parseSongPage(): Promise<this> {
    //
    // }
}
