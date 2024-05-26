import {
    Collection,
    Filter,
    MongoClient,
    ObjectId,
    ServerApiVersion,
    Sort,
    WithId,
} from "mongodb";
import dotenv from "dotenv";
import Logger from "./logger";
import { Color, Mathematician, User } from "./types";
import bcrypt from "bcrypt";

dotenv.config();

const dbUri: string | undefined = process.env.DB_URI;
const credentials: string | undefined = process.env.DB_CERT_PATH;

export default class Database extends Logger {
    private _client: MongoClient;
    private _mathCollection?: Collection<Mathematician>;
    private _userCollection?: Collection<User>;

    private _timer?: NodeJS.Timeout;
    private _lastUpdate: number = Date.now();

    mathematicians: WithId<Mathematician>[] = [];
    users: WithId<User>[] = [];

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

        this.refreshData();
    }

    async refreshData(force = false) {
        if (
            !force &&
            this._lastUpdate + 60000 > Date.now() &&
            this.mathematicians.length &&
            this.users.length
        ) {
            return;
        }

        await this.connect();
        this._mathCollection = this._client.db("math_api").collection("people");
        this._userCollection = this._client.db("math_api").collection("users");
        this.mathematicians =
            (await this._mathCollection?.find().toArray()) ?? [];
        this.users = (await this._userCollection?.find().toArray()) ?? [];
        this._lastUpdate = Date.now();
        this.emit("updated");
    }

    async connect() {
        if (this.ready) return;
        this._timer = setTimeout(() => {
            this.log("Database connection timed out");
            this.close();
        }, 60000); // 1 minute
        await this._client.connect();
        this.log("Database connected");
        this._setReady();
    }

    async close() {
        clearTimeout(this._timer);
        await this._client.close();
        this.log("Database closed");
        this._setReady(false);
    }

    async getMathematicians(
        filter: Filter<Mathematician> = {},
        sort: Sort = {}
    ): Promise<WithId<Mathematician>[] | null> {
        await this.connect();
        return this._mathCollection?.find(filter).sort(sort).toArray() ?? null;
    }

    async updateMathematician(_id: ObjectId, update: Partial<Mathematician>) {
        await this.connect();
        const res = await this._mathCollection?.updateOne(
            { _id },
            { $set: update }
        );
        await this.refreshData(true);
        return res;
    }

    async getUser(
        username: string,
        cache = true
    ): Promise<WithId<User> | null> {
        if (!cache) await this.refreshData(true);
        return this.users.find((user) => user.username === username) ?? null;
    }

    async addUser(user: User) {
        await this.connect();
        if (await this.getUser(user.username, false)) return false;
        const res = (await this._userCollection?.insertOne(user)) ?? false;
        await this.refreshData(true);
        return res;
    }

    async login(username: string, pass: string) {
        const user = await this.getUser(username, false);
        if (!user) return false;

        return bcrypt.compareSync(pass, user.pass) ? user : false;
    }

    onReady(callback: () => void) {
        this.on("ready", callback);
    }

    onClosed(callback: () => void) {
        this.on("closed", callback);
    }

    onUpdated(callback: () => void) {
        this.on("updated", callback);
    }

    private _setReady(val: boolean = true) {
        this.ready = val;
        this.emit(val ? "ready" : "closed");
    }
}
