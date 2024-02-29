export interface Mathematician {
	id: string;
	name: string;
	description: string;
	age: number;
	alive: boolean;
	born_bc: boolean;
	birth_date: string;
	// Url to an image
	picture: string;
	field: "Algebra" | "Geometry" | "Calculus" | "Statistics & Probability";
	main_interests: string[];
	best_known_for: Formula;
}

export interface Formula {
	id: string;
	name: string;
	description: string;
}
