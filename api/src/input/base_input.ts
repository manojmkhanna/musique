import {Input} from "parsque-api";

export default class BaseInput extends Input {
    url: string;
    params: object;
    cookies: object;
}
