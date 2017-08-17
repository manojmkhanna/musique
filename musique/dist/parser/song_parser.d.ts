/// <reference types="bluebird" />
import * as Promise from "bluebird";
import BaseParser from "./base_parser";
import SongInput from "../input/song_input";
import SongOutput from "../output/song_output";
import SongContent from "../content/song_content";
export default class SongParser extends BaseParser<SongInput, SongOutput, SongContent> {
    parse(): Promise<this>;
}
