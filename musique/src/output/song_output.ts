import BaseOutput from "./base_output";
import AlbumOutput from "./album_output";
import ArtistOutput from "./artist_output";

export default class SongOutput extends BaseOutput {
    public comments: string;
    public duration: string;
    public genre: string;
    public lyrics: string;
    public mp3: string;
    public played: number;
    public quality: string;
    public rating: number;
    public subtitle: string;
    public title: string;
    public track: number;
    public album: AlbumOutput;
    public artists: ArtistOutput[];
    public writers: ArtistOutput[];
}
