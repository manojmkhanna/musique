import * as Promise from "bluebird";

import BaseParser from "./base_parser";
import PlaylistInput from "../input/playlist_input";
import PlaylistOutput from "../output/playlist_output";
import PlaylistContent from "../content/playlist_content";

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
        return this.parseTitle();
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    public parseTitle(): Promise<this> {
        return this.parseValue("title", () => this.createTitle());
    }
}
