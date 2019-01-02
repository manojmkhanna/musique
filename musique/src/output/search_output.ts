import {Output} from "parsque";
import AlbumOutput from "./album_output";
import ArtistOutput from "./artist_output";
import PlaylistOutput from "./playlist_output";
import SongOutput from "./song_output";

export default class SearchOutput extends Output {
    public songs: SongOutput[];
    public albums: AlbumOutput[];
    public artists: ArtistOutput[];
    public playlists: PlaylistOutput[];
}
