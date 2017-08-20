import { Content, Input, Output, Parser } from "parsque";
import Platform from "../platform/platform";
export default abstract class BaseParser<I extends Input, O extends Output, C extends Content> extends Parser<I, O, C> {
    protected platform: Platform | undefined;
    constructor(platform?: Platform | undefined);
}
