import {
    Collection,
    Filter,
    MongoClient,
    ServerApiVersion,
    Sort,
    WithId,
} from "mongodb";
import dotenv from "dotenv";
import { EventEmitter } from "events";
import { Mathematician } from "./types";
import Logger from "./logger";
import { Color } from "./common";

dotenv.config();

const dbUri: string | undefined = process.env.DB_URI;
const credentials: string | undefined = process.env.DB_CERT_PATH;

export default class Database extends Logger {
    private _client: MongoClient;
    private _collection?: Collection<Mathematician>;
    ready: boolean = false;

    constructor() {
        super("Database", Color.yellow);

        if (!dbUri) {
            console.error("DB_URI is not set");
            process.exit(1);
        }

        this._client = new MongoClient(dbUri, {
            tlsCertificateKeyFile: credentials,
            serverApi: ServerApiVersion.v1,
        });
    }

    async connect() {
        await this._client.connect();
        this._collection = this._client.db("math_api").collection("people");
        this.log("Database connected");
        this._setReady();
    }

    async close() {
        await this._client.close();
        this.log("Database closed");
        this._setReady(false);
    }

    async getMathematicians(
        filter: Filter<Mathematician> = {},
        sort: Sort = {}
    ): Promise<WithId<Mathematician>[]> {
        return (
            (await this._collection?.find(filter).sort(sort).toArray()) ?? []
        );
    }

    onReady(callback: () => void) {
        this.on("ready", callback);
    }

    offReady(callback: () => void) {
        this.off("ready", callback);
    }

    onClosed(callback: () => void) {
        this.on("closed", callback);
    }

    offClosed(callback: () => void) {
        this.off("closed", callback);
    }

    private _setReady(val: boolean = true) {
        this.ready = val;
        this.emit(val ? "ready" : "closed");
    }
}
