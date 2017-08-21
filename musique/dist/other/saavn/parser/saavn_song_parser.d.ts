/// <reference types="bluebird" />
import * as Promise from "bluebird";
import SongParser from "../../../parser/song_parser";
import SongContent from "../../../content/song_content";
export default class SaavnSongParser extends SongParser {
    protected createContent(): Promise<SongContent>;
    protected createTitle(): Promise<string>;
}