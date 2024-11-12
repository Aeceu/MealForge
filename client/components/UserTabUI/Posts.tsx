import { RootState } from "@/redux/store";
import { Image, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "@/constants/colors";
import { useColorScheme } from "nativewind";

const Posts = () => {
	const { colorScheme } = useColorScheme();
	const { NewGradientColor } = useThemeColors();
	const { post } = useSelector((state: RootState) => state.post);
	const { user } = useSelector((state: RootState) => state.user);

	if (!user) {
		return <StyledText>No user is found!</StyledText>;
	}

	return (
		<View className="w-full h-full p-2 flex-col">
			{post.length > 0 ? (
				post.map(
					(item, i) =>
						item.user_id === user.id && (
							<View
								key={i}
								className="w-full bg-light  dark:bg-dark-light rounded-lg p-4 border border-light-border dark:border-dark-border my-1 overflow-hidden">
								{item.recipe_post_image && (
									<View className="w-full h-full absolute top-0 left-0">
										<Image
											source={{ uri: item.recipe_post_image }}
											resizeMode="cover"
											className="absolute w-full  h-[150px]"
											style={{ opacity: colorScheme === "dark" ? 0.2 : 0.4 }}
										/>
										<LinearGradient
											start={{ x: 1, y: 0 }}
											end={{ x: 0, y: 0 }}
											colors={NewGradientColor}
											className="absolute top-0 left-0 w-full  h-[150px]"
										/>
									</View>
								)}

								<StyledPressable
									size="link"
									onPress={() =>
										router.push(`/(home_screen)/user_post/${item.id}`)
									}>
									<StyledText className="font-chunk text-lg">
										{item.recipe.name}
									</StyledText>
								</StyledPressable>

								<ScrollView
									horizontal
									showsHorizontalScrollIndicator={false}
									className="w-full">
									<View className="mt-2 flex-row items-start justify-center w-full">
										{item.recipe.ingredients.split(",").map((ingredient, i) => (
											<StyledText
												key={i}
												className="px-3 bg-light-dark dark:bg-dark py-1 text-xs mr-0.5 rounded-full w-max">
												{ingredient}
											</StyledText>
										))}
									</View>
								</ScrollView>

								<View className="flex-row items-center justify-between w-full px-2 pt-4 pb-0">
									<StyledPressable
										size="text"
										className="flex-row items-center">
										<StyledText className="flex font-psemibold">
											{item.total_likes}
										</StyledText>
										<StyledText
											className="flex ml-1"
											type="xs"
											fontStyle="light">
											Likes
										</StyledText>

										<StyledText className="mx-2 text-2xl">•</StyledText>

										<StyledText className="font-psemibold">0</StyledText>
										<StyledText className="ml-1" type="xs" fontStyle="light">
											Dislike
										</StyledText>
									</StyledPressable>
								</View>
							</View>
						)
				)
			) : (
				<StyledText>No Recipe is added!</StyledText>
			)}
		</View>
	);
};
export default Posts;
