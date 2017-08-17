import BaseOutput from "./base_output";
import ArtistOutput from "./artist_output";
import SongOutput from "./song_output";
export default class AlbumOutput extends BaseOutput {
    art: string;
    duration: string;
    label: string;
    language: string;
    released: string;
    title: string;
    artists: ArtistOutput[];
    composers: ArtistOutput[];
    producers: ArtistOutput[];
    songs: SongOutput[];
}
