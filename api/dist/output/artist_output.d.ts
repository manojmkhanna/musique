import BaseOutput from "./base_output";
import AlbumOutput from "./album_output";
import SongOutput from "./song_output";
export default class ArtistOutput extends BaseOutput {
    title: string;
    albums: AlbumOutput[];
    songs: SongOutput[];
}
