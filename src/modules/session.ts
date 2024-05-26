import dotenv from "dotenv";
dotenv.config();

import session, { MemoryStore } from "express-session";
import { User } from "./types";

declare module "express-session" {
    export interface SessionData {
        user: User;
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "",
    store: new MemoryStore(),
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
});
