import express from "express";
import ejs, { render } from "ejs"; // This is used internally by express (I think)

import {
    ValueType,
    compareString,
    fetchJson,
    includesString,
    sortCopy,
} from "./common";
import type { Formula, Mathematician } from "./types";

let data: Mathematician[] = [];

(async () => {
    data = await fetchJson("mathematicians");
})();

// =================== Server ===================

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use((req, res, next) => {
    if (!req.query.search) return next();
    const results = search(req.query.search as string);
    res.render("search", { results, query: req.query.search });
});

// =================== Routes ===================

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/people", async (req, res) => {
    let people = [...data];
    let sort = "name";
    let order = "asc";
    if (req.query.filter) {
        const filter = req.query.filter as string;
        people = data.filter((person) => includesString(person.name, filter));
    }
    if (req.query.sort) {
        sort = req.query.sort as string;
        order = req.query.order as string;
        people = sortData(sort as keyof Mathematician, order);
    }

    res.render("people", {
        cards: people,
        sort,
        asc: order === "asc" ? true : false,
    });
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
    else res.render("person", { person });
});

app.get("/formulas", (req, res) => {
    let formulas = data.map((data) => data.best_known_for);
    res.render("formulas", { formulas });
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

// =================== Helper functions ===================

/**
 * Creates a list of mathematicians and formulas that include the search query
 * @param query - search query
 * @returns an array of mathematicians and formulas
 */
function search(query: string): (Mathematician | Formula)[] {
    let results = data
        .map(searchPeople, { query })
        .filter((result) => result !== null) as (Mathematician | Formula)[];

    results = results.concat(
        data
            .map(searchFormulas, { query })
            .filter((result) => result !== null) as (Mathematician | Formula)[]
    );

    return results;
}

/**
 * Checks if the persons name includes the search query
 * @param this - an object containing the search query
 * @param person - person to check
 * @returns the person if found, null otherwise
 */
function searchPeople(this: any, person: Mathematician): Mathematician | null {
    return includesString(person.name, this.query) ? person : null;
}

/**
 * Checks if the formula name includes the search query
 * @param this - an object containing the search query
 * @param formula - formula to check
 * @returns the formula if found, null otherwise
 */
function searchFormulas(this: any, person: Mathematician): Formula | null {
    return includesString(person.best_known_for.name, this.query)
        ? person.best_known_for
        : null;
}

/** Sorts the data by a key without mutating the original array
 * @param key - key to sort by
 * @param order - order to sort in
 * @returns a sorted array
 **/
function sortData(key: keyof Mathematician, order: string) {
    let type: ValueType = "string";
    if (key === "age") type = "number";
    if (key === "birth_date") type = "date";

    return sortCopy(data, key, order, type);
}

export {};
