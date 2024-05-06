import { BSON, ObjectId } from "mongodb";

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

export type ValueType = "string" | "number" | "date";

export type Field = "Algebra" | "Geometry" | "Calculus" | "Statistics";
