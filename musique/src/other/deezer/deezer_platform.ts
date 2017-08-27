import Platform from "../../platform/platform";
import SongParser from "../../parser/song_parser";
import DeezerSongParser from "./parser/deezer_song_parser";
import AlbumParser from "../../parser/album_parser";
import DeezerAlbumParser from "./parser/deezer_album_parser";
import ArtistParser from "../../parser/artist_parser";
import DeezerArtistParser from "./parser/deezer_artist_parser";

export default class DeezerPlatform extends Platform {
    public createSongParser(): SongParser {
        return new DeezerSongParser(this);
    }

    public createAlbumParser(): AlbumParser {
        return new DeezerAlbumParser(this);
    }

    public createArtistParser(): ArtistParser {
        return new DeezerArtistParser(this);
    }
}
