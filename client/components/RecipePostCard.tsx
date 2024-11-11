import { useColorScheme } from "nativewind";
import { View, ScrollView, TouchableOpacity } from "react-native";
import StyledText from "./StyledText";
import { Link } from "expo-router";
import { RecipePost } from "@/utils/types/post";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";

type TRecipePostCard = {
	recipe: RecipePost;
};
const RecipePostCard: React.FC<TRecipePostCard> = ({ recipe }) => {
	const { colorScheme } = useColorScheme();
	return (
		<View className="flex-1 w-full mt-2 bg-white border border-light-border dark:bg-dark-light dark:border-dark-border rounded-xl">
			{/* Header */}
			<Link href={`/(home_screen)/post/${recipe.id}`} asChild>
				<TouchableOpacity>
					<View className="flex-col px-4 pt-4 rounded-t-xl ">
						<View className="flex-row justify-between flex-1 w-full">
							<StyledText type="heading-4" className="flex-1 font-chunk">
								{recipe.recipe.name}
							</StyledText>
							<BookmarkButton
								is_bookmarked={recipe.is_bookmarked}
								post_id={recipe.id}
							/>
						</View>

						<StyledText type="label" className="text-main">
							@{recipe.author}
						</StyledText>
					</View>
				</TouchableOpacity>
			</Link>

			<View className="px-4 pb-4 rounded-xl">
				{/* Body */}
				{/* <View className="flex-col w-full mt-4 border rounded-xl border-light-border dark:border-dark-border"> */}
				{/* <Link href={`/(home_screen)/recipe/${recipe.id}`} asChild>
						<TouchableOpacity>
							<Image
								source={images.adobo}
								resizeMode="cover"
								className="w-full h-[150px] rounded-t-xl object-center"
							/>
						</TouchableOpacity>
					</Link> */}

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="w-full">
					<View className="flex-row items-start justify-center w-full pr-1 pt-2 pb-1">
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

				{/* <ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="w-full">
					<View className="flex-row items-start justify-center w-full pr-1 pt-1 pb-2">
						{[recipe.recipe.nutrient_counts.split(",")].map((item, i) => (
							<StyledText
								key={i}
								type="label"
								className="w-max bg-light-dark dark:bg-dark px-3 py-1.5 rounded-full mx-0.5 ">
								{item}
							</StyledText>
						))}
					</View>
				</ScrollView> */}
				{/* </View> */}

				{/* Footer */}
				<LikeButton recipe={recipe} />
			</View>
		</View>
	);
};

export default RecipePostCard;
