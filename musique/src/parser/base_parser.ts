import {Content, Input, Output, Parser} from "parsque";
import * as Promise from "bluebird";

import Platform from "../platform/platform";

export default abstract class BaseParser<I extends Input, O extends Output, C extends Content> extends Parser<I, O, C> {
    public constructor(protected platform: Platform) {
        super();
    }

    public abstract parse(): Promise<this>;
}
