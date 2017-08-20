import SongParser from "../parser/song_parser";

export default abstract class Platform {
    public abstract createSongParser(): SongParser;

    public abstract createAlbumParser(): SongParser;

    public abstract createArtistParser(): SongParser;

    public abstract createPlaylistParser(): SongParser;

    public abstract createSearchParser(): SongParser;
}
