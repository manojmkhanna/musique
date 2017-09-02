/// <reference types="bluebird" />
import { Parser } from "parsque";
import * as Promise from "bluebird";
import BaseInput from "../input/base_input";
import BaseOutput from "../output/base_output";
import BaseContent from "../content/base_content";
import Platform from "../platform/platform";
export default class BaseParser<I extends BaseInput, O extends BaseOutput, C extends BaseContent> extends Parser<I, O, C> {
    protected readonly platform: Platform;
    constructor(platform: Platform);
    parse(): Promise<this>;
    protected createUrl(): Promise<string>;
    parseUrl(): Promise<this>;
}
