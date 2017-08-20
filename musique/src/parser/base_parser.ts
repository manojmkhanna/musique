import {Parser} from "parsque";
import * as Promise from "bluebird";

import BaseInput from "../input/base_input";
import BaseOutput from "../output/base_output";
import BaseContent from "../content/base_content";
import Platform from "../platform/platform";

export default abstract class BaseParser<I extends BaseInput,
    O extends BaseOutput, C extends BaseContent> extends Parser<I, O, C> {
    public constructor(protected platform: Platform) {
        super();
    }

    public abstract parse(): Promise<this>;
}
