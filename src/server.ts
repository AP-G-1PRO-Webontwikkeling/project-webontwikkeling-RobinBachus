import express from "express";
import ejs, { render } from "ejs";

import json from "./public/assets/json/test.json";

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use((req, res, next) => {
    // Check is search query is present
    if (req.query.search) {
        const search = (req.query.search as string).toLowerCase();
        const results = json.filter((person) =>
            person.name.toLowerCase().includes(search)
        );
        if (results.length === 1) res.redirect(`/people/${results[0].name}`);
        else res.render("people", { cards: results });
    } else next();
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/people", (req, res) => {
    res.render("people", { cards: json });
});

app.get("/people/:name", (req, res) => {
    const { name } = req.params;
    const person = json.find((person) => compareString(person.name, name));

    // if person is not found return 404 page
    if (!person)
        res.status(404).render("error", {
            message: "Person not found",
            status: `404 - Page Not Found`,
        });
    else res.render("person", { person });
});

app.get("/formulas", (req, res) => {
    res.render("formulas");
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
