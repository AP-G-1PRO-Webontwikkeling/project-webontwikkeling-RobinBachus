import { fetchJson } from "./common";
import { Formula, Mathematician } from "./types";

import readline from "readline-sync";

(async function main() {
    const mathematicians = await fetchJson("mathematicians");
    const formulas = await fetchJson("formulas");

    let exit: boolean = false;
    while (!exit) {
        console.log(
            "\nWelcome to the JSON data viewer!\
		\
		\n\n1. View all data \
		\n2. Search by ID \
		\n3. Exit"
        );

        const choice: number = readline.questionInt(
            "\nPlease enter your choice: "
        );
        console.log("");

        switch (choice) {
            case 1:
                showAll(mathematicians);
                break;
            case 2:
                findById(mathematicians);
                break;
            case 3:
                exit = true;
                break;

            default:
                console.log("Invalid command!");
                break;
        }

        if (!exit)
            readline.question("\nHit Enter key to continue.", {
                hideEchoBack: true,
                mask: "",
            });
    }
})();

function showAll(mathematicians: Mathematician[]) {
    for (const person of mathematicians)
        console.log(person.name, `(${person.id})`);
}

function findById(mathematicians: Mathematician[]) {
    const id: string = readline.question("Please enter the ID: ");
    const person = mathematicians.find(
        (m) => m.id.toLowerCase() === id.toLowerCase()
    );

    let key: keyof Mathematician;

    // Width of the longest property name
    const maxWidth = Object.keys(mathematicians[0]).reduce(
        (max, key) => Math.max(max, key.length),
        0
    );

    if (!person) console.log("Could not find mathematician with ID", id);
    else {
        for (key in person)
            console.log(
                (key as string).padEnd(maxWidth + 1),
                "-",
                person[key],
                key === "description" ? "\n" : ""
            );
    }
    console.log();
}

export {};
