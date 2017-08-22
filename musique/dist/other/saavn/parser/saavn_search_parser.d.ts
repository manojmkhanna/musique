/// <reference types="bluebird" />
import * as Promise from "bluebird";
import SearchParser from "../../../parser/search_parser";
import SearchContent from "../../../content/search_content";
export default class SaavnSearchParser extends SearchParser {
    protected createContent(): Promise<SearchContent>;
    protected contentCreated(): Promise<any>;
    protected createTitle(): Promise<string>;
}
