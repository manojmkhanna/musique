import {Parser} from "parsque";
import * as Promise from "bluebird";

import SearchInput from "../input/search_input";
import SearchOutput from "../output/search_output";
import SearchContent from "../content/search_content";

export default class SearchParser extends Parser<SearchInput, SearchOutput, SearchContent> {
    protected createInput(): Promise<SearchInput> {
        return new Promise<SearchInput>(resolve => {
            resolve(new SearchInput());
        });
    }

    protected createOutput(): Promise<SearchOutput> {
        return new Promise<SearchOutput>(resolve => {
            resolve(new SearchOutput());
        });
    }

    protected createContent(): Promise<SearchContent> {
        return new Promise<SearchContent>(resolve => {
            resolve(new SearchContent());
        });
    }

    public parse(): Promise<this> {
        return new Promise<this>(() => {
        });
    }
}
