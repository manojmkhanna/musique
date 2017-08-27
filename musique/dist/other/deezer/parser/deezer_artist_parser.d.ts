/// <reference types="bluebird" />
import * as Promise from "bluebird";
import ArtistParser from "../../../parser/artist_parser";
import ArtistContent from "../../../content/artist_content";
export default class DeezerArtistParser extends ArtistParser {
    protected createContent(): Promise<ArtistContent>;
    protected contentCreated(): Promise<void>;
    protected createTitle(): Promise<string>;
}
