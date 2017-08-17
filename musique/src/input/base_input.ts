import {Input} from "parsque";

export default class BaseInput extends Input {
    public url: string;
    public params: object;
    public cookies: object;
}
