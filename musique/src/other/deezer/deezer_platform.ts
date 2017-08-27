import Platform from "../../platform/platform";
import SongParser from "../../parser/song_parser";
import DeezerSongParser from "./parser/deezer_song_parser";

export default class DeezerPlatform extends Platform {
    public createSongParser(): SongParser {
        return new DeezerSongParser(this);
    }
}
