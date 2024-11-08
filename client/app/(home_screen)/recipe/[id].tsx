import Spin from "@/components/animations/Spin";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { icons, images } from "@/constants";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Image } from "react-native";
import { ScrollView, Text, View } from "react-native";

const RecipePostPage = () => {
	const { id } = useLocalSearchParams();
	const { colorScheme } = useColorScheme();
	const [loading, setLoading] = useState(false);
	return (
		<ScrollView
			// contentContainerStyle={{ flexGrow: 1 }}
			className="w-full p-4 bg-light dark:bg-dark">

			<View className="mb-8">

				{/* Header */}
				<View className="w-full h-[150px] mb-4">
					<Image
						source={images.adobo}
						resizeMode="cover"
						className="object-center w-full h-full rounded-xl"
					/>
				</View>
				<View className="mx-2 mb-4">
					<View className="flex-row justify-between flex-1 w-full">
						<StyledText type="heading-4" className="flex-1 font-chunk">
							Spaghetti Bolognese
							{/* {recipe.recipe.name} */}
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

					{/* <StyledText type="heading-3" className="font-chunk">
						Spaghetti Bolognese
					</StyledText> */}
					<StyledText type="label" className="mt-px text-main">
						@johndoe
					</StyledText>

					{/* save */}

					{/* like/dislike */}
					<View className="flex-row items-start justify-between w-full mt-4 ">
						<StyledPressable size="text" className="flex-row items-center">
							<StyledText className="flex font-psemibold">
								69
								{/* {recipe.likes.length} */}
							</StyledText>
							<StyledText className="flex ml-1" type="xs" fontStyle="light">
								Likes
								{/* {recipe.likes.length === 1 ? "Like" : "Likes"} */}
							</StyledText>

							<StyledText className="mx-2 text-2xl ">•</StyledText>

							<StyledText className="font-psemibold">
								0
							</StyledText>
							<StyledText className="ml-1" type="xs" fontStyle="light">
								Dislikes
								{/* {recipe.likes.length === 1 ? "Dislike" : "Dislikes"} */}
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
				</View>

				{/* Separator */}
				<View className="flex-1 h-px mx-2 mb-4 rounded-full bg-light-border dark:bg-dark-border"></View>

				{/* Ingredients */}
				<View className="mb-4">
					<StyledText type="subheading" className="px-2 mb-2">
						Ingredients:
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

				{/* Instructions */}
				<View className="mb-4">
					<StyledText type="subheading" className="px-2 mb-2">
						Instructions:
					</StyledText>
					<View className="w-full px-6 py-4 space-y-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						<StyledText type="paragraph" className="">
							• Clean that chick
						</StyledText>
						<StyledText type="paragraph" className="">
							• Slice this shits
						</StyledText>
						<StyledText type="paragraph" className="">
							• Fry those fuckers
						</StyledText>
						<StyledText type="paragraph" className="">
							• Pour those vinegar and soy sauce
						</StyledText>
						<StyledText type="paragraph" className="">
							• Pour those vinegar and soy sauce
						</StyledText>
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
