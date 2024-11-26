import { z } from "zod";

export type TRecipe = {
	id: string;
	name: string;
	ingredients: string;
	instruction: string;
	type_of_cuisine: string;
	nutrient_counts: string;
	serve_hot_or_cold: string;
	cooking_time: string;
	benefits: string;
	serve_for: string;
	difficulty: string;
};

export const NewRecipeSchema = z.object({
	servings: z.string(),
	serve_hot_or_cold: z.string(),
	cuisine_type: z.string(),
	difficulty: z.string(),
	main_ingredients: z
		.array(z.string().min(1, "Ingredient name cannot be empty"))
		.min(1, "At least one main ingredient is required"),
	seasonings: z
		.array(z.string().min(1, "Seasoning name cannot be empty"))
		.min(2, "At least two seasonings are required"),
});

export type TNewRecipe = z.infer<typeof NewRecipeSchema>;
