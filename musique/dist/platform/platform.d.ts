import SongParser from "../parser/song_parser";
export default abstract class Platform {
    abstract createSongParser(): SongParser;
}
