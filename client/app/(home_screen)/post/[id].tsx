import BookmarkButton from "@/components/BookmarkButton";
import LikeButton from "@/components/LikeButton";
import Loading from "@/components/Loading";
import StyledText from "@/components/StyledText";
import { getPostById } from "@/redux/actions/postAction";
import { AppDispatch, RootState } from "@/redux/store";
import { RecipePost } from "@/utils/types/post";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image } from "react-native";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const RecipePostPage = () => {
	const { id } = useLocalSearchParams();
	const [post, setPost] = useState<RecipePost | null>(null);

	const dispatch = useDispatch<AppDispatch>();
	const { status } = useSelector((state: RootState) => state.post);
	const { user } = useSelector((state: RootState) => state.user);

	useEffect(() => {
		if (!user) {
			Alert.alert("No user is found!");
			return router.back();
		}
		dispatch(getPostById({ postId: id, user_id: user.id })).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				setPost(res.payload);
			}
		});
	}, []);

	if (status === "pending") return <Loading />;

	if (!post) {
		return (
			<ScrollView className="w-full p-4 bg-light dark:bg-dark">
				<View className="flex-col items-center">
					<StyledText className="text-red-500">No Post is found!</StyledText>
				</View>
			</ScrollView>
		);
	}
	return (
		<ScrollView
			// contentContainerStyle={{ flexGrow: 1 }}
			className="w-full p-4 bg-light dark:bg-dark">
			<View className="mb-8">
				{/* Header */}
				{post.recipe_post_image && (
					<View className="w-full h-[150px] mb-4">
						<Image
							source={{ uri: post.recipe_post_image }}
							resizeMode="cover"
							className="object-center w-full h-full rounded-xl"
						/>
					</View>
				)}
				<View className="mx-2 mb-4">
					<View className="flex-row justify-between flex-1 w-full">
						<StyledText type="heading-4" className="flex-1 font-chunk">
							{post?.recipe.name}
						</StyledText>
						<BookmarkButton
							post_id={post.id}
							is_bookmarked={post.is_bookmarked}
						/>
					</View>

					{/* <StyledText type="heading-3" className="font-chunk">
						Spaghetti Bolognese
					</StyledText> */}
					<StyledText type="label" className="mt-px text-main">
						@{post?.author}
					</StyledText>

					{/* save */}

					{/* like/dislike */}
					<LikeButton recipe={post} />
				</View>

				{/* Separator */}
				<View className="flex-1 h-px mx-2 mb-4 rounded-full bg-light-border dark:bg-dark-border"></View>

				{/* Infos */}
				<View className="mb-4">
					<StyledText type="subheading" className="px-2 mb-2 font-chunk">
						Recipe Information:
					</StyledText>
					<View className="w-full px-4 py-4 space-y-2 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
						<View className="px-2 flex-row items-center bg-light-dark dark:bg-dark-light rounded-full w-max ">
							<StyledText type="paragraph">• Serve for: </StyledText>
							<StyledText type="paragraph">
								{post?.recipe.serve_for} people{" "}
							</StyledText>
						</View>
						<View className="px-2 flex-row items-center bg-light-dark dark:bg-dark-light rounded-full w-max ">
							<StyledText type="paragraph">• Serve in: </StyledText>
							<StyledText type="paragraph">
								{post?.recipe.serve_hot_or_cold}{" "}
							</StyledText>
						</View>
						<View className="px-2 flex-row items-center bg-light-dark dark:bg-dark-light rounded-full w-max ">
							<StyledText type="paragraph">• Cooking time: </StyledText>
							<StyledText type="paragraph">
								{post?.recipe.cooking_time} minutes{" "}
							</StyledText>
						</View>
						<View className="px-2 flex-row items-center bg-light-dark dark:bg-dark-light rounded-full w-max ">
							<StyledText type="paragraph">• Cuisine type: </StyledText>
							<StyledText type="paragraph">
								{post?.recipe.type_of_cuisine}{" "}
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
						{post?.recipe.ingredients.split(",").map((item, i) => (
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
						{post?.recipe.instruction.split("Step ").map(
							(item: string, i: number) =>
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
				<View className="flex-1 h-px mx-2 mt-2 mb-4 rounded-full bg-light-border dark:bg-dark-border" />

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
