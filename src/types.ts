import { BSON, ObjectId } from "mongodb";

export interface Mathematician extends BSON.Document {
    id: string;
    name: string;
    description: string;
    age: number;
    alive: boolean;
    born_bc: boolean;
    birth_date: string;
    // Url to an image
    picture: string;
    field: "Algebra" | "Geometry" | "Calculus" | "Statistics";
    main_interests: string[];
    best_known_for: Formula;
}

export interface Formula {
    id: string;
    name: string;
    description: string;
}

export type ValueType = "string" | "number" | "date";
