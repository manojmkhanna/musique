import Platform from "../../platform/platform";
import SongParser from "../../parser/song_parser";
import SaavnSongParser from "./parser/saavn_song_parser";
import AlbumParser from "../../parser/album_parser";
import SaavnAlbumParser from "./parser/saavn_album_parser";
import ArtistParser from "../../parser/artist_parser";
import SaavnArtistParser from "./parser/saavn_artist_parser";
import PlaylistParser from "../../parser/playlist_parser";
import SaavnPlaylistParser from "./parser/saavn_playlist_parser";
import SearchParser from "../../parser/search_parser";
import SaavnSearchParser from "./parser/saavn_search_parser";

export default class SaavnPlatform extends Platform {
    public constructor(public readonly name: string) {
        super(name);
    }

    public createSongParser(): SongParser {
        return new SaavnSongParser(this);
    }

    public createAlbumParser(): AlbumParser {
        return new SaavnAlbumParser(this);
    }

    public createArtistParser(): ArtistParser {
        return new SaavnArtistParser(this);
    }

    public createPlaylistParser(): PlaylistParser {
        return new SaavnPlaylistParser(this);
    }

    public createSearchParser(): SearchParser {
        return new SaavnSearchParser(this);
    }
}
