/// <reference types="bluebird" />
import * as Promise from "bluebird";
import PlaylistParser from "../../../parser/playlist_parser";
import PlaylistContent from "../../../content/playlist_content";
export default class SaavnPlaylistParser extends PlaylistParser {
    protected createContent(): Promise<PlaylistContent>;
    protected contentCreated(): Promise<any>;
    protected createTitle(): Promise<string>;
}
