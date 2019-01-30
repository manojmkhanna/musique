import AlbumInput from "./album_input";
import BaseInput from "./base_input";
import PlaylistInput from "./playlist_input";
import SongInput from "./song_input";

export default class ArtistInput extends BaseInput {
    public albums: AlbumInput[];
    public playlists: PlaylistInput[];
    public songs: SongInput[];
}
