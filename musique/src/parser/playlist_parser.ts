import * as Promise from "bluebird";

import BaseParser from "./base_parser";
import PlaylistInput from "../input/playlist_input";
import PlaylistOutput from "../output/playlist_output";
import PlaylistContent from "../content/playlist_content";
import SongOutput from "../output/song_output";
import SongParser from "./song_parser";

export default class PlaylistParser extends BaseParser<PlaylistInput, PlaylistOutput, PlaylistContent> {
    protected createInput(): Promise<PlaylistInput> {
        return new Promise<PlaylistInput>(resolve => {
            resolve(new PlaylistInput());
        });
    }

    protected createOutput(): Promise<PlaylistOutput> {
        return new Promise<PlaylistOutput>(resolve => {
            resolve(new PlaylistOutput());
        });
    }

    protected createContent(): Promise<PlaylistContent> {
        return new Promise<PlaylistContent>(resolve => {
            resolve(new PlaylistContent());
        });
    }

    public parse(): Promise<this> {
        return super.parse()
            .then(() => this.parseTitle())
            .then(() => this.parseSongs());
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
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
