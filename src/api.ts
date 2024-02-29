import { Formula, Mathematician } from "./types";

export async function fetchJson(file:"mathematicians"): Promise<Mathematician[]>
export async function fetchJson(file:"formulas"): Promise<Formula[]>
export async function fetchJson(file:string) {
    const data = await fetch(`https://raw.githubusercontent.com/RobinBachus/mathematician-api/main/json/${file}.json`)
    return data.json()
}