import { Color, colorize } from "./common";
import { EventEmitter } from "events";

export default abstract class Logger extends EventEmitter {
    private _process: string;
    private _color: Color;

    constructor(process: string, color: Color) {
        super();

        this._process = process;
        this._color = color;
    }

    protected log(message: string, error?: boolean) {
        const prefix = colorize(this._process, error ? Color.red : this._color);
        console.log(`${prefix}: ${message}`);
    }
}
