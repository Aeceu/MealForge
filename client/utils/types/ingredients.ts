import z from "zod";

export const IngredientSchema = z.object({
	type: z.string().min(1, "Required"),
	name: z.string().min(1, "Required"),
	measurements: z.string().min(1, "Required"),
	expirationDate: z.date().optional(),
});

export type TNewIngredients = z.infer<typeof IngredientSchema>;

export type TIngredients = {
	id: string;
	name: string;
	type: string;
	measurements: string;
	expirationDate: Date | null | undefined;
	date_added: string;
};
