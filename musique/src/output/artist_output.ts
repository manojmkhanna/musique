import AlbumOutput from "./album_output";
import BaseOutput from "./base_output";
import PlaylistOutput from "./playlist_output";
import SongOutput from "./song_output";

export default class ArtistOutput extends BaseOutput {
    public title: string;
    public albums: AlbumOutput[];
    public songs: SongOutput[];
    public playlists: PlaylistOutput[];
}
