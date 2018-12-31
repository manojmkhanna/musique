import BaseOutput from "./base_output";
import SongOutput from "./song_output";

export default class PlaylistOutput extends BaseOutput {
    public title: string;
    public songs: SongOutput[];
}
