/// <reference types="bluebird" />
import * as Promise from "bluebird";
import BaseParser from "./base_parser";
import PlaylistInput from "../input/playlist_input";
import PlaylistOutput from "../output/playlist_output";
import PlaylistContent from "../content/playlist_content";
import SongOutput from "../output/song_output";
import SongParser from "./song_parser";
export default class PlaylistParser extends BaseParser<PlaylistInput, PlaylistOutput, PlaylistContent> {
    protected createInput(): Promise<PlaylistInput>;
    protected createOutput(): Promise<PlaylistOutput>;
    protected createContent(): Promise<PlaylistContent>;
    parse(): Promise<this>;
    protected createTitle(): Promise<string>;
    protected createSongs(): Promise<SongOutput[]>;
    parseTitle(): Promise<this>;
    parseSongs(outputsParser?: (childParser: SongParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
}
