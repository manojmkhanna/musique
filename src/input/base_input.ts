import {Input} from "parsque";

export default class BaseInput extends Input {
    url: string;
    params: object;
    cookies: object;
}
