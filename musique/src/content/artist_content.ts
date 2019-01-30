import AlbumContent from "./album_content";
import BaseContent from "./base_content";
import PlaylistContent from "./playlist_content";
import SongContent from "./song_content";

export default class ArtistContent extends BaseContent {
    public albums: AlbumContent[];
    public playlists: PlaylistContent[];
    public songs: SongContent[];
}
