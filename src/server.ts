import express from "express";
import ejs, { render } from "ejs";

import { fetchJson } from "./common";
import type { Formula, Mathematician } from "./types";

let data: Mathematician[] = [];

(async () => {
    data = await fetchJson("mathematicians");
})();

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use((req, res, next) => {
    if (!req.query.search) return next();
    const results = search(req.query.search as string);
    res.render("search", { results, query: req.query.search });
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/people", async (req, res) => {
    if (req.query.filter) {
        const filter = req.query.filter as string;
        data = data.filter((person) => includesString(person.name, filter));
    }

    res.render("people", { cards: data });
});

app.get("/people/:name", (req, res) => {
    const name = req.params.name;
    const person = data.find((person) => compareString(person.name, name));

    // if person is not found return 404 page
    if (!person)
        res.status(404).render("error", {
            message: "Person not found",
            status: `404 - Page Not Found`,
        });
    else 
    res.render("person", { person });
});

app.get("/formulas", (req, res) => {
    res.render("formulas", {
        formulas: data.map((data) => data.best_known_for),
    });
});

app.get("/formulas/:name", (req, res) => {
    const name = req.params.name;
    const formula = data.find((data) =>
        compareString(data.best_known_for.name, name)
    )?.best_known_for;

    if (!formula)
        res.status(404).render("error", {
            message: "Formula not found",
            status: `404 - Page Not Found`,
        });
    else res.render("formula", { formula });
});

app.listen(app.get("port"), () => {
    console.log(`Server is running on http://localhost:${app.get("port")}`);
});

/**
 * Compare two strings ignoring case and whitespace
 * @param a - first string
 * @param b - second string
 * @returns true if strings are equal, false otherwise
 */
function compareString(a: string, b: string) {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/**
 * Check if a string includes another string ignoring case and whitespace
 * @param a - string to search in
 * @param b - string to search for
 * @returns true if a includes b, false otherwise
 */
function includesString(a: string, b: string) {
    return a.toLowerCase().includes(b.trim().toLowerCase());
}

/**
 * Creates a list of mathematicians and formulas that include the search query
 * @param query - search query
 * @returns an array of mathematicians and formulas
 */
function search(query: string): (Mathematician | Formula)[] {
    const results: (Mathematician | Formula)[] = data.filter(searchPredicate, {
        query,
    });

    return results;
}

/**
 * Predicate function for the search method
 * @this - object with the search query
 * @param person - mathematician to check
 * @returns the mathematician or formula if it includes the query
 */
function searchPredicate(
    this: any,
    person: Mathematician
): Mathematician | Formula | void {
    let query = this.query;
    if (includesString(person.name, query)) return person;
    if (includesString(person.best_known_for.name, query))
        return person.best_known_for;
}

export {};
