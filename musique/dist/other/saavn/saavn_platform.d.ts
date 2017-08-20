import Platform from "../../platform/platform";
import SongParser from "../../parser/song_parser";
export default class SaavnPlatform extends Platform {
    createSongParser(): SongParser;
}
