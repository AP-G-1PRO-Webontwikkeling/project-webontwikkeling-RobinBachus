import type { BSON, ObjectId } from "mongodb";

export interface Mathematician extends BSON.Document {
    _id: ObjectId;
    id: string;
    name: string;
    description: string;
    age: number;
    alive: boolean;
    born_bc: boolean;
    birth_date: string;
    // Url to an image
    picture: string;
    field: Field;
    main_interests: string[];
    best_known_for: Formula;
}

export interface Formula {
    id: string;
    name: string;
    description: string;
}

export interface Edit {
    age: number;
    dead: "on" | null;
    field: Field;
    interests: string;
}

export interface User {
    username: string;
    password_hash: string;
    image: string;
}

export type ValueType = "string" | "number" | "date";

export type Field = "Algebra" | "Geometry" | "Calculus" | "Statistics";

export type SortOrder = "asc" | "desc";

export type TColor = Color;

/** Color codes for console output*/
export enum Color {
    red = "\x1b[31m",
    green = "\x1b[32m",
    yellow = "\x1b[33m",
    blue = "\x1b[34m",
    magenta = "\x1b[35m",
    cyan = "\x1b[36m",
    white = "\x1b[37m",
    reset = "\x1b[0m",
}
