import BaseInput from "./base_input";
import AlbumInput from "./album_input";
import SongInput from "./song_input";
import PlaylistInput from "./playlist_input";

export default class ArtistInput extends BaseInput {
    public albums: AlbumInput[];
    public songs: SongInput[];
    public playlists: PlaylistInput[];
}
