import DeezerPlatform from "../other/deezer/deezer_platform";
import SaavnPlatform from "../other/saavn/saavn_platform";

export default class Platforms {
    public readonly deezer: DeezerPlatform = new DeezerPlatform();
    public readonly saavn: SaavnPlatform = new SaavnPlatform();
}
