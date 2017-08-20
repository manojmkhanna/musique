/// <reference types="bluebird" />
import { Parser } from "parsque";
import * as Promise from "bluebird";
import BaseInput from "../input/base_input";
import BaseOutput from "../output/base_output";
import BaseContent from "../content/base_content";
import Platform from "../platform/platform";
export default abstract class BaseParser<I extends BaseInput, O extends BaseOutput, C extends BaseContent> extends Parser<I, O, C> {
    protected platform: Platform;
    constructor(platform: Platform);
    abstract parse(): Promise<this>;
}
