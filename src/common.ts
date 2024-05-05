import { Formula, Mathematician, ValueType } from "./types";

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

export async function fetchJson(
    file: "mathematicians"
): Promise<Mathematician[]>;
export async function fetchJson(file: "formulas"): Promise<Formula[]>;
export async function fetchJson(file: string) {
    const data = await fetch(
        `https://raw.githubusercontent.com/RobinBachus/mathematician-api/main/json/${file}.json`
    );
    return data.json();
}

export function colorize(text: string, color: Color) {
    return `${color}${text}${Color.reset}`;
}

/**
 * Compare two strings ignoring case and whitespace
 * @param a - first string
 * @param b - second string
 * @returns true if strings are equal, false otherwise
 */
export function compareString(a: string, b: string) {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/**
 * Check if a string includes another string ignoring case and whitespace
 * @param a - string to search in
 * @param b - string to search for
 * @returns true if a includes b, false otherwise
 */
export function includesString(a: string, b: string) {
    return a.toLowerCase().includes(b.trim().toLowerCase());
}

/**
 * Sort an array by a key without mutating the original array
 * @template T - type of the array
 * @param data - data to sort
 * @param key - key to sort by
 * @param order - order to sort in
 * @returns a sorted array
 */
export function sortCopy<T>(
    data: T[],
    key: keyof T,
    order: string,
    valueType: ValueType
) {
    const copy = [...data];
    switch (valueType) {
        case "string":
            return sortCopyByString(copy, key, order);
        case "number":
            return sortCopyByNumber(copy, key, order);
        case "date":
            return sortCopyByDate(copy, key, order);
        default:
            return copy;
    }
}

function sortCopyByString<T>(data: T[], key: keyof T, order: string) {
    const copy = [...data];
    return copy.sort((a, b) => {
        return (
            (a[key] as string).localeCompare(b[key] as string) *
            (order === "asc" ? 1 : -1)
        );
    });
}

function sortCopyByNumber<T>(data: T[], key: keyof T, order: string) {
    const copy = [...data];
    return copy.sort((a, b) => {
        return (
            (a[key] as number) - (b[key] as number) * (order === "asc" ? 1 : -1)
        );
    });
}

function sortCopyByDate<T>(data: T[], key: keyof T, order: string) {
    const copy = [...data];
    return copy.sort((a, b) => {
        return (
            new Date(a[key] as string).getTime() -
            new Date(b[key] as string).getTime() * (order === "asc" ? 1 : -1)
        );
    });
}
