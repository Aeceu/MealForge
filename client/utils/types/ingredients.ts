import z from "zod";

export const IngredientSchema = z.object({
	name: z.string().min(1, "Required"),
	type: z.string().min(1, "Required"),
	measurements: z.string().min(1, "Required"),
	expirationDate: z.date(),
});

export type TNewIngredients = z.infer<typeof IngredientSchema>;

export type TIngredients = {
	id: string;
	name: string;
	type: string;
	measurements: string;
	expirationDate: string;
	date_added: string;
};
