import SongParser from "../parser/song_parser";
export default abstract class Platform {
    abstract parseSong(url: string): SongParser;
    abstract parseAlbum(url: string): SongParser;
    abstract parseArtist(url: string): SongParser;
    abstract parsePlaylist(url: string): SongParser;
    abstract parseSearch(query: string): SongParser;
}
