import type { BSON, ObjectId } from "mongodb";

declare global {
    interface Mathematician extends BSON.Document {
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

    interface Formula {
        id: string;
        name: string;
        description: string;
    }

    interface Edit {
        age: number;
        dead: "on" | null;
        field: Field;
        interests: string;
    }

    interface User {
        username: string;
        password_hash: string;
        image: string;
    }

    type ValueType = "string" | "number" | "date";

    type Field = "Algebra" | "Geometry" | "Calculus" | "Statistics";

    type SortOrder = "asc" | "desc";

    type TColor = Color;
}

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
