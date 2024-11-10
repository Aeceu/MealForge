import { RootState } from "@/redux/store";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import Spin from "../animations/Spin";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";
import { router } from "expo-router";

const Posts = () => {
	const { userPost, status } = useSelector((state: RootState) => state.post);

	if (status === "pending")
		return (
			<View className="p-4">
				<Spin loading={status === "pending"} size="md" />
			</View>
		);

	return (
		<View className="w-full h-full p-2 flex-col">
			{!userPost || userPost.length <= 0 ? (
				<StyledText>No Recipe is added!</StyledText>
			) : (
				userPost.map((item, i) => (
					<View key={i} className="w-full bg-dark-light rounded-lg p-4 my-1">
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
								{item.recipe.ingredients.split(",").map((item, i) => (
									<StyledText
										key={i}
										className="px-3 bg-light-dark dark:bg-dark py-1 text-xs mr-0.5 rounded-full w-max ">
										{item}
									</StyledText>
								))}
							</View>
						</ScrollView>
						<View className="flex-row items-center justify-between w-full px-2 pt-4 pb-0 ">
							<StyledPressable size="text" className="flex-row items-center">
								<StyledText className="flex font-psemibold">
									{/* {recipe.likes.length} */}0
								</StyledText>
								<StyledText className="flex ml-1" type="xs" fontStyle="light">
									{/* {recipe.likes.length === 1 ? "Like" : "Likes"} */}
									Likes
								</StyledText>

								<StyledText className="mx-2 text-2xl ">•</StyledText>

								<StyledText className="font-psemibold">0</StyledText>
								<StyledText className="ml-1" type="xs" fontStyle="light">
									{/* {recipe.likes.length === 1 ? "Dislike" : "Dislikes"} */}
									Dislike
								</StyledText>
							</StyledPressable>
						</View>
					</View>
				))
			)}
		</View>
	);
};
export default Posts;
