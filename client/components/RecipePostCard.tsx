import { icons, images } from "@/constants";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { View, ScrollView, Image, Text } from "react-native";
import Spin from "./animations/Spin";
import StyledPressable from "./StyledPressable";
import StyledText from "./StyledText";
import { TRecipePost } from "@/utils/types/user";

type TRecipePostCard = {
	recipe: TRecipePost;
};

const RecipePostCard: React.FC<TRecipePostCard> = ({ recipe }) => {
	const { colorScheme } = useColorScheme();
	const [loading, setLoading] = useState(false);
	return (
		<View className="w-full bg-light-dark  dark:bg-dark-light p-4 rounded-xl mt-4">
			{/* Header */}
			<View className="flex-col">
				<View className="w-full flex-row items-center justify-between">
					<StyledText type="heading-4" className="font-semibold">
						{recipe.recipe.name}
					</StyledText>
					<StyledPressable onPress={() => setLoading(!loading)} size="icon">
						{loading ? (
							<Spin size="md" loading={loading} />
						) : (
							<Image
								source={
									colorScheme === "dark"
										? icons.bookmarkLightDark
										: icons.bookmarkDarkLight
								}
								resizeMode="contain"
								className="w-6 h-6"
							/>
						)}
					</StyledPressable>
				</View>
				<Text className="text-sm text-dark-light dark:text-light-dark">
					@{recipe.user.userName}
				</Text>
			</View>

			{/* Body */}
			<View className="mt-2 w-full  flex-col rounded-xl border border-dark-light/10 dark:border-light-dark/10">
				<Image
					source={images.adobo}
					resizeMode="cover"
					className="w-full h-[150px] rounded-t-xl object-center"
				/>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="w-full">
					<View className="w-full flex-row items-start justify-center px-1 py-2">
						{recipe.recipe.ingredients.split(",").map((item, i) => (
							<StyledText
								key={i}
								type="label"
								className="w-max bg-light dark:bg-dark px-3 py-1.5 rounded-full mx-0.5 ">
								{item}
							</StyledText>
						))}
					</View>
				</ScrollView>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="w-full">
					<View className="w-full flex-row items-start justify-center px-1 py-2">
						{[recipe.recipe.nutrient_counts.split(",")].map((item, i) => (
							<StyledText
								key={i}
								type="label"
								className="w-max bg-light dark:bg-dark px-3 py-1.5 rounded-full mx-0.5 ">
								{item}
							</StyledText>
						))}
					</View>
				</ScrollView>
			</View>

			{/* Footer */}
			<View className="p-2 w-full flex-row items-center justify-between mt-4">
				<View className="flex-row items-center ">
					<StyledText className="">{recipe.likes.length}</StyledText>
					<StyledText className="text-sm ml-1 ">Likes</StyledText>
					<StyledText className="text-2xl mx-2 ">•</StyledText>
					<StyledText className="">0</StyledText>
					<StyledText className="text-sm ml-1 ">Dislikes</StyledText>
				</View>

				<View className="flex-row items-center ">
					<StyledPressable size="icon">
						<Image
							source={
								colorScheme === "dark"
									? icons.likesLightDark
									: icons.likesDarkLight
							}
							resizeMode="contain"
							className="w-6 h-6 mx-1"
						/>
					</StyledPressable>
					<StyledPressable size="icon">
						<Image
							source={
								colorScheme === "dark"
									? icons.unlikesLightDark
									: icons.unlikesDarkLight
							}
							resizeMode="contain"
							className="w-6 h-6 mx-1"
						/>
					</StyledPressable>
				</View>
			</View>
		</View>
	);
};

export default RecipePostCard;
