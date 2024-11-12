import Loading from "@/components/Loading";
import StyledText from "@/components/StyledText";
import { images } from "@/constants";
import { getUserRecipe } from "@/redux/actions/recipeAction";
import { AppDispatch, RootState } from "@/redux/store";
import { TRecipe } from "@/utils/types/recipe";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const RecipePostPage = () => {
	const { id } = useLocalSearchParams();
	const [recipe, setRecipe] = useState<TRecipe | null>(null);

	const dispatch = useDispatch<AppDispatch>();
	const { status } = useSelector((state: RootState) => state.recipe);
	useEffect(() => {
		dispatch(getUserRecipe(id)).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				setRecipe(res.payload);
			}
		});
	}, []);

	if (status === "pending") return <Loading />;

	return (
		<ScrollView className="w-full p-4 bg-light dark:bg-dark">
			<View className="mb-8">
				{/* Header */}
				<View className="mx-2 mb-4">
					<View className="flex-row justify-between flex-1 w-full">
						<StyledText
							type="heading-4"
							className="flex-1  font-chunk text-2xl">
							{recipe?.name}
						</StyledText>
					</View>
				</View>

				{/* Separator */}
				<View className="flex-1 h-px mx-2 mb-4 rounded-full bg-light-border dark:bg-dark-border"></View>

				{/* Infos */}
				<View className="mb-4">
					<StyledText type="subheading" className="px-2 mb-2 font-chunk">
						Recipe Information:
					</StyledText>
					<View className="w-full px-6 py-4 space-y-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						<View className="flex-row items-center bg-light-dark dark:bg-dark-light rounded-full w-max ">
							<StyledText type="paragraph">• Serve for: </StyledText>
							<StyledText type="paragraph">
								{recipe?.serve_for} people{" "}
							</StyledText>
						</View>
						<View className="flex-row items-center bg-light-dark dark:bg-dark-light rounded-full w-max ">
							<StyledText type="paragraph">• Serve in: </StyledText>
							<StyledText type="paragraph">
								{recipe?.serve_hot_or_cold}{" "}
							</StyledText>
						</View>
						<View className="flex-row items-center bg-light-dark dark:bg-dark-light rounded-full w-max ">
							<StyledText type="paragraph">• Cooking time: </StyledText>
							<StyledText type="paragraph">
								{recipe?.cooking_time} minutes{" "}
							</StyledText>
						</View>
						<View className="flex-row items-center bg-light-dark dark:bg-dark-light rounded-full w-max ">
							<StyledText type="paragraph">• Cuisine type: </StyledText>
							<StyledText type="paragraph">
								{recipe?.type_of_cuisine}{" "}
							</StyledText>
						</View>
					</View>
				</View>

				{/* Ingredients */}
				<View className="mb-4">
					<StyledText type="subheading" className="px-2 mb-2 font-chunk">
						Ingredients:
					</StyledText>
					<View className="w-full px-6 py-4 space-y-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						{recipe?.ingredients.split(",").map((item, i) => (
							<StyledText key={i} type="paragraph" className="">
								• {item}
							</StyledText>
						))}
					</View>
				</View>

				{/* Instructions */}
				<View className="mb-4">
					<StyledText type="subheading" className="px-2 mb-2 font-chunk">
						Instructions:
					</StyledText>
					<View className="w-full px-6 py-4 space-y-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						{recipe?.instruction.split("Step ").map(
							(item, i) =>
								item && ( // Check to ignore any empty strings from the split
									<StyledText key={i} type="paragraph">
										• Step {item.trim()}
									</StyledText>
								)
						)}
					</View>
				</View>

				{/* vvv optional vvv */}
				{/* remove "mb-4" sa last */}

				{/* Separator */}
				<View className="flex-1 h-px mx-2 mt-2 mb-4 rounded-full bg-light-border dark:bg-dark-border"></View>

				{/* More Like This */}
				<View className="">
					<StyledText type="subheading" className="px-2 mb-2">
						More Like This
					</StyledText>
					<View className="w-full px-6 py-4 space-y-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						<StyledText type="paragraph" className="">
							• 1/2 Chicken
						</StyledText>
						<StyledText type="paragraph" className="">
							• 2 Bayleaf
						</StyledText>
						<StyledText type="paragraph" className="">
							• Vinegar
						</StyledText>
						<StyledText type="paragraph" className="">
							• Soy Sauce
						</StyledText>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

export default RecipePostPage;
