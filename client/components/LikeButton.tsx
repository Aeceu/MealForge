import { Alert, Image, TouchableOpacity, View } from "react-native";
import StyledPressable from "./StyledPressable";
import { icons } from "@/constants";
import { useColorScheme } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { likeorunlikePost } from "@/redux/actions/postAction";
import { useState } from "react";
import Spin from "./animations/Spin";
import { Link } from "expo-router";
import StyledText from "./StyledText";
import { RecipePost } from "@/utils/types/post";

type Props = {
	recipe: RecipePost;
};

const LikeButton: React.FC<Props> = ({ recipe }) => {
	const { colorScheme } = useColorScheme();
	const dispatch = useDispatch<AppDispatch>();
	const [loading, setLoading] = useState(false);
	const { user } = useSelector((state: RootState) => state.user);
	const [isLiked, setIsLiked] = useState(recipe.is_liked);
	const [totalLikes, setTotalLikes] = useState(recipe.total_likes);

	const onLikeButton = () => {
		if (!user) return Alert.alert("No user is found!");
		setLoading(true);
		dispatch(
			likeorunlikePost({
				post_id: recipe.id,
				user_id: user.id,
			})
		).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				setLoading(false);
				Alert.alert(res.payload.message);
				// If naka like, i unlike!
				if (isLiked) {
					setTotalLikes((prev) => prev - 1);
					setIsLiked((prev) => !prev);
				} else {
					setTotalLikes((prev) => prev + 1);
					setIsLiked((prev) => !prev);
				}
			}
			if (res.meta.requestStatus === "rejected") {
				setLoading(false);
				Alert.alert(res.payload.message);
			}
		});
	};

	return (
		<Link href={`/(home_screen)/post/${recipe.id}`} asChild>
			<TouchableOpacity>
				<View className="flex-row items-center justify-between w-full px-2 pt-4 pb-0 ">
					<StyledPressable size="text" className="flex-row items-center">
						<StyledText className="flex font-psemibold">
							{totalLikes}
						</StyledText>
						<StyledText className="flex ml-1" type="xs" fontStyle="light">
							{totalLikes <= 1 ? "Like" : "Likes"}
						</StyledText>

						<StyledText className="mx-2 text-2xl ">•</StyledText>

						<StyledText className="font-psemibold">0</StyledText>
						<StyledText className="ml-1" type="xs" fontStyle="light">
							{/* {recipe.likes.length === 1 ? "Dislike" : "Dislikes"} */}
							Dislike
						</StyledText>
					</StyledPressable>

					<View className="flex-row items-center space-x-2">
						<StyledPressable
							disabled={loading}
							onPress={onLikeButton}
							size="icon">
							{loading ? (
								<Spin size="sm" loading={loading} />
							) : (
								<Image
									source={
										colorScheme === "dark"
											? isLiked
												? icons.likeOrange
												: icons.likesLightDark
											: isLiked
											? icons.likeOrange
											: icons.likesDarkLight
									}
									resizeMode="contain"
									className="w-6 h-6"
								/>
							)}
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
	);
};
export default LikeButton;
