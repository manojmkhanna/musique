/// <reference types="bluebird" />
import { Content, Input, Output, Parser } from "parsque";
import * as Promise from "bluebird";
import Platform from "../platform/platform";
export default abstract class BaseParser<I extends Input, O extends Output, C extends Content> extends Parser<I, O, C> {
    protected platform: Platform;
    constructor(platform: Platform);
    abstract parse(): Promise<this>;
}
