import BaseOutput from "./base_output";
import AlbumOutput from "./album_output";
import SongOutput from "./song_output";
import PlaylistOutput from "./playlist_output";
export default class ArtistOutput extends BaseOutput {
    title: string;
    albums: AlbumOutput[];
    songs: SongOutput[];
    playlists: PlaylistOutput[];
}
