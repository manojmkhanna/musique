import {Input} from "parsque";
import AlbumInput from "./album_input";
import ArtistInput from "./artist_input";
import PlaylistInput from "./playlist_input";
import SongInput from "./song_input";

export default class SearchInput extends Input {
    public query: string;
    public songs: SongInput[];
    public albums: AlbumInput[];
    public artists: ArtistInput[];
    public playlists: PlaylistInput[];
}
