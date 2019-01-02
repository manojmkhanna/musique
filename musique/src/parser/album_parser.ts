import * as Promise from "bluebird";
import AlbumContent from "../content/album_content";
import AlbumInput from "../input/album_input";
import AlbumOutput from "../output/album_output";
import ArtistOutput from "../output/artist_output";
import SongOutput from "../output/song_output";
import ArtistParser from "./artist_parser";
import BaseParser from "./base_parser";
import SongParser from "./song_parser";

export default class AlbumParser extends BaseParser<AlbumInput, AlbumOutput, AlbumContent> {
    protected createInput(): Promise<AlbumInput> {
        return new Promise<AlbumInput>(resolve => {
            resolve(new AlbumInput());
        });
    }

    protected createOutput(): Promise<AlbumOutput> {
        return new Promise<AlbumOutput>(resolve => {
            resolve(new AlbumOutput());
        });
    }

    protected createContent(): Promise<AlbumContent> {
        return new Promise<AlbumContent>(resolve => {
            resolve(new AlbumContent());
        });
    }

    public parse(): Promise<this> {
        return super.parse()
            .then(() => this.parseArt())
            .then(() => this.parseDate())
            .then(() => this.parseLabel())
            .then(() => this.parseLanguage())
            .then(() => this.parseTitle())
            .then(() => this.parseYear())
            .then(() => this.parseArtists())
            .then(() => this.parseSongs());
    }

    protected createArt(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    protected createDate(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    protected createLabel(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    protected createLanguage(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    protected createYear(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    protected createArtists(): Promise<ArtistOutput[]> {
        return new Promise<ArtistOutput[]>(resolve => {
            resolve();
        });
    }

    protected createSongs(): Promise<SongOutput[]> {
        return new Promise<SongOutput[]>(resolve => {
            resolve();
        });
    }

    public parseArt(): Promise<this> {
        return this.parseValue("art", () => this.createArt());
    }

    public parseDate(): Promise<this> {
        return this.parseValue("date", () => this.createDate());
    }

    public parseLabel(): Promise<this> {
        return this.parseValue("label", () => this.createLabel());
    }

    public parseLanguage(): Promise<this> {
        return this.parseValue("language", () => this.createLanguage());
    }

    public parseTitle(): Promise<this> {
        return this.parseValue("title", () => this.createTitle());
    }

    public parseYear(): Promise<this> {
        return this.parseValue("year", () => this.createYear());
    }

    public parseArtists(outputsParser?: (childParser: ArtistParser, index: number) => Promise<any>,
                        ...indexes: number[]): Promise<this> {
        if (!outputsParser) {
            return this.parseValue("artists", () => this.createArtists());
        } else {
            return this.parseOutputs("artists", () => new Promise<ArtistParser>(resolve => {
                resolve(this.platform.createArtistParser());
            }), outputsParser, ...indexes);
        }
    }

    public parseSongs(outputsParser?: (childParser: SongParser, index: number) => Promise<any>,
                      ...indexes: number[]): Promise<this> {
        if (!outputsParser) {
            return this.parseValue("songs", () => this.createSongs());
        } else {
            return this.parseOutputs("songs", () => new Promise<SongParser>(resolve => {
                resolve(this.platform.createSongParser());
            }), outputsParser, ...indexes);
        }
    }
}
