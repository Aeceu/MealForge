import { icons, images } from "@/constants";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { View, ScrollView, Image, TouchableOpacity, Text } from "react-native";
import Spin from "./animations/Spin";
import StyledPressable from "./StyledPressable";
import StyledText from "./StyledText";
import { TRecipePost } from "@/utils/types/user";
import { Link } from "expo-router";
type TRecipePostCard = {
	recipe: TRecipePost;
};

const RecipePostCard: React.FC<TRecipePostCard> = ({ recipe }) => {
	const { colorScheme } = useColorScheme();
	const [loading, setLoading] = useState(false);
	return (
		<View className="flex-1 w-full mt-2 bg-white border border-light-border dark:bg-dark-light dark:border-dark-border rounded-xl">
			{/* Header */}
			<Link href={"/(home_screen)/recipe/1"} asChild>
				<TouchableOpacity>
					<View className="flex-col px-4 pt-4 rounded-t-xl ">

						<View className="flex-row justify-between flex-1 w-full">
							<StyledText type="heading-4" numberOfLines={2} className="flex-1 font-chunk">
								{recipe.recipe.name}
							</StyledText>
							<StyledPressable onPress={() => setLoading(!loading)} size="icon" className="">
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

						<StyledText type="label" className="text-main">
							@{recipe.user.userName}
						</StyledText>
					</View>
				</TouchableOpacity>
			</Link>

			<View className="px-4 pb-4 rounded-xl">
				{/* Body */}
				<View className="flex-col w-full mt-4 border rounded-xl border-light-border dark:border-dark-border">

					<Link href={"/(home_screen)/recipe/1"} asChild>
						<TouchableOpacity>
							<Image
								source={images.adobo}
								resizeMode="cover"
								className="w-full h-[150px] rounded-t-xl object-center"
							/>
						</TouchableOpacity>
					</Link>

					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						className="w-full">
						<View className="flex-row items-start justify-center w-full px-1 pt-2 pb-1">
							{recipe.recipe.ingredients.split(",").map((item, i) => (
								<StyledText
									key={i}
									type="label"
									className="px-3 bg-light-dark dark:bg-dark py-1.5 mx-0.5 rounded-full w-max ">
									{item}
								</StyledText>
							))}
						</View>
					</ScrollView>

					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						className="w-full">
						<View className="flex-row items-start justify-center w-full px-1 pt-1 pb-2">
							{[recipe.recipe.nutrient_counts.split(",")].map((item, i) => (
								<StyledText
									key={i}
									type="label"
									className="w-max bg-light-dark dark:bg-dark px-3 py-1.5 rounded-full mx-0.5 ">
									{item}
								</StyledText>
							))}
						</View>
					</ScrollView>
				</View>

				{/* Footer */}
				<Link href={"/(home_screen)/recipe/1"} asChild>
					<TouchableOpacity>
						<View className="flex-row items-center justify-between w-full px-2 pt-4 pb-0 ">
							<StyledPressable size="text" className="flex-row items-center">
								<StyledText className="flex font-psemibold">
									{recipe.likes.length}
								</StyledText>
								<StyledText className="flex ml-1" type="xs" fontStyle="light">
									{recipe.likes.length === 1 ? "Like" : "Likes"}
								</StyledText>

								<StyledText className="mx-2 text-2xl ">•</StyledText>

								<StyledText className="font-psemibold">0</StyledText>
								<StyledText className="ml-1" type="xs" fontStyle="light">
									{recipe.likes.length === 1 ? "Dislike" : "Dislikes"}
								</StyledText>
							</StyledPressable>

							<View className="flex-row items-center space-x-2">
								<StyledPressable size="icon">
									<Image
										source={
											colorScheme === "dark"
												? icons.likesLightDark
												: icons.likesDarkLight
										}
										resizeMode="contain"
										className="w-6 h-6"
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
										className="w-6 h-6"
									/>
								</StyledPressable>
							</View>
						</View>
					</TouchableOpacity>
				</Link>
			</View>
		</View>
	);
};

export default RecipePostCard;
