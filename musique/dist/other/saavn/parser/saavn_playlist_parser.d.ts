/// <reference types="bluebird" />
import * as Promise from "bluebird";
import PlaylistParser from "../../../parser/playlist_parser";
import PlaylistContent from "../../../content/playlist_content";
import SongOutput from "../../../output/song_output";
export default class SaavnPlaylistParser extends PlaylistParser {
    protected createContent(): Promise<PlaylistContent>;
    protected contentCreated(): Promise<void>;
    protected createTitle(): Promise<string>;
    protected createSongs(): Promise<SongOutput[]>;
}
