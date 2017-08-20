import * as Promise from "bluebird";

import BaseParser from "./base_parser";
import ArtistInput from "../input/artist_input";
import ArtistOutput from "../output/artist_output";
import ArtistContent from "../content/artist_content";

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
