import { Output } from "parsque";
import SongOutput from "./song_output";
import AlbumOutput from "./album_output";
import ArtistOutput from "./artist_output";
import PlaylistOutput from "./playlist_output";
export default class SearchOutput extends Output {
    songs: SongOutput[];
    albums: AlbumOutput[];
    artists: ArtistOutput[];
    playlists: PlaylistOutput[];
}