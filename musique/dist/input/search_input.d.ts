import { Input } from "parsque";
import SongInput from "./song_input";
import AlbumInput from "./album_input";
import ArtistInput from "./artist_input";
import PlaylistInput from "./playlist_input";
export default class SearchInput extends Input {
    query: string;
    songs: SongInput[];
    albums: AlbumInput[];
    artists: ArtistInput[];
    playlists: PlaylistInput[];
}
