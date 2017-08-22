/// <reference types="bluebird" />
import * as Promise from "bluebird";
import AlbumParser from "../../../parser/album_parser";
import AlbumContent from "../../../content/album_content";
export default class SaavnAlbumParser extends AlbumParser {
    protected createContent(): Promise<AlbumContent>;
    protected contentCreated(): Promise<any>;
    protected createTitle(): Promise<string>;
}
