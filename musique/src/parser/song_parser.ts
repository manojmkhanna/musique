import * as Promise from "bluebird";

import BaseParser from "./base_parser";
import SongInput from "../input/song_input";
import SongOutput from "../output/song_output";
import SongContent from "../content/song_content";

export default class SongParser extends BaseParser<SongInput, SongOutput, SongContent> {
    protected abstract createii

    public parse(): Promise<this> {

    }

    protected createInput(): Promise<SongInput> {
        return new Promise<SongInput>(resolve => {
            resolve(new SongInput());
        });
    }

    protected createOutput(): Promise<SongOutput> {
        return new Promise<SongOutput>(resolve => {
            resolve(new SongOutput());
        });
    }

    protected createContent(): Promise<SongContent> {
        return new Promise<SongContent>(resolve => {
            resolve(new SongContent());
        });
    }
}
