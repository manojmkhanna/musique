import * as Promise from "bluebird";

import BaseParser from "./base_parser";
import ArtistInput from "../input/artist_input";
import ArtistOutput from "../output/artist_output";
import ArtistContent from "../content/artist_content";
import AlbumOutput from "../output/album_output";
import AlbumParser from "./album_parser";
import SongOutput from "../output/song_output";
import SongParser from "./song_parser";

export default class ArtistParser extends BaseParser<ArtistInput, ArtistOutput, ArtistContent> {
    protected createInput(): Promise<ArtistInput> {
        return new Promise<ArtistInput>(resolve => {
            resolve(new ArtistInput());
        });
    }

    protected createOutput(): Promise<ArtistOutput> {
        return new Promise<ArtistOutput>(resolve => {
            resolve(new ArtistOutput());
        });
    }

    protected createContent(): Promise<ArtistContent> {
        return new Promise<ArtistContent>(resolve => {
            resolve(new ArtistContent());
        });
    }

    public parse(): Promise<this> {
        return this.parseTitle()
            .then(() => this.parseAlbums())
            .then(() => this.parseSongs());
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    protected createAlbums(): Promise<AlbumOutput[]> {
        return new Promise<AlbumOutput[]>(resolve => {
            resolve();
        });
    }

    protected createSongs(): Promise<SongOutput[]> {
        return new Promise<SongOutput[]>(resolve => {
            resolve();
        });
    }

    public parseTitle(): Promise<this> {
        return this.parseValue("title", () => this.createTitle());
    }

    public parseAlbums(outputsParser?: (childParser: AlbumParser, index: number) => Promise<any>,
                       ...indexes: number[]): Promise<this> {
        if (outputsParser == undefined) {
            return this.parseValue("albums", () => this.createSongs());
        } else {
            return this.parseOutputs("albums", () => new Promise<AlbumParser>(resolve => {
                resolve(this.platform.createAlbumParser());
            }), outputsParser, ...indexes);
        }
    }

    public parseSongs(outputsParser?: (childParser: SongParser, index: number) => Promise<any>,
                      ...indexes: number[]): Promise<this> {
        if (outputsParser == undefined) {
            return this.parseValue("songs", () => this.createSongs());
        } else {
            return this.parseOutputs("songs", () => new Promise<SongParser>(resolve => {
                resolve(this.platform.createSongParser());
            }), outputsParser, ...indexes);
        }
    }
}
