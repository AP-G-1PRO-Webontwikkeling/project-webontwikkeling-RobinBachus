import { Color } from "./types";
import Database from "./database";
import Logger from "./logger";

const events = [
    `exit`,
    `SIGINT`,
    `SIGUSR1`,
    `SIGUSR2`,
    `uncaughtException`,
    `SIGTERM`,
];

export default class CleanUp extends Logger {
    private _database: Database;
    private _exitCode: number = 0;

    constructor(database: Database) {
        super("CleanUp", Color.blue);

        this._database = database;
        this._addListeners();
    }

    private _addListeners() {
        events.forEach((eventType) => {
            if (eventType === "uncaughtException") {
                process.on(eventType, async (err) => {
                    this.log(`Uncaught Exception:`, true);
                    console.error(err);
                    this._exitCode = 1;
                    await this._cleanUp(eventType);
                });
                return;
            }
            process.on(eventType, async () => await this._cleanUp(eventType));
        });
    }

    private _removeListeners() {
        events.forEach((eventType) => {
            process.removeAllListeners(eventType);
        });
    }

    private async _cleanUp(eventType?: string) {
        if (eventType) {
            this.log(`Received signal: ${eventType}`);
        }

        this.log("Cleaning up...");

        await this._database.close();

        this.log("Cleanup complete");
        this._removeListeners();
        process.exit(this._exitCode);
    }
}
