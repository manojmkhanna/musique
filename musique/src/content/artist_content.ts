import BaseContent from "./base_content";
import AlbumContent from "./album_content";
import SongContent from "./song_content";
import PlaylistContent from "./playlist_content";

export default class ArtistContent extends BaseContent {
    public albums: AlbumContent[];
    public songs: SongContent[];
    public playlists: PlaylistContent[];
}
