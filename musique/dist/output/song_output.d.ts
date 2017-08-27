import BaseOutput from "./base_output";
import AlbumOutput from "./album_output";
import ArtistOutput from "./artist_output";
export default class SongOutput extends BaseOutput {
    duration: string;
    genre: string;
    lyrics: string;
    mp3: string;
    title: string;
    track: number;
    album: AlbumOutput;
    artists: ArtistOutput[];
}
