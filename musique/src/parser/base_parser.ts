import * as Promise from "bluebird";
import {Parser} from "parsque";
import BaseContent from "../content/base_content";
import BaseInput from "../input/base_input";
import BaseOutput from "../output/base_output";
import Platform from "../platform/platform";

export default class BaseParser<I extends BaseInput,
    O extends BaseOutput, C extends BaseContent> extends Parser<I, O, C> {
    public constructor(protected readonly platform: Platform) {
        super();
    }

    public parse(): Promise<this> {
        return this.parseUrl();
    }

    protected createUrl(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve(this.input.url);
        });
    }

    public parseUrl(): Promise<this> {
        return this.parseValue("url", () => this.createUrl());
    }
}
