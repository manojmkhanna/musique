import * as Promise from "bluebird";

import BaseParser from "./base_parser";
import AlbumInput from "../input/album_input";
import AlbumOutput from "../output/album_output";
import AlbumContent from "../content/album_content";

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
