import { RootState } from "@/redux/store";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import Spin from "../animations/Spin";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";
import { router } from "expo-router";
const Recipes = () => {
	const { recipe, status } = useSelector((state: RootState) => state.recipe);

	if (status === "pending")
		return (
			<View className="p-4 flex items-center">
				<Spin loading={status === "pending"} size="md" />
			</View>
		);
	return (
		<View className="w-full h-full p-2 flex-col">
			{!recipe || recipe.length <= 0 ? (
				<StyledText>No Recipe is added!</StyledText>
			) : (
				recipe.map((item, i) => (
					<View
						key={i}
						className="w-full bg-white dark:bg-dark-light rounded-lg p-4   border border-light-border dark:border-dark-border my-1">
						<StyledPressable
							size="link"
							onPress={() =>
								router.push(`/(home_screen)/user_recipe/${item.id}`)
							}>
							<StyledText className="font-chunk text-lg">
								{item.name}
							</StyledText>
						</StyledPressable>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							className="w-full">
							<View className="mt-2 flex-row items-start justify-center w-full">
								{item.ingredients.split(",").map((item, i) => (
									<StyledText
										key={i}
										className="px-3 bg-light-dark dark:bg-dark py-1 text-xs mr-0.5 rounded-full w-max ">
										{item}
									</StyledText>
								))}
							</View>
						</ScrollView>
					</View>
				))
			)}
		</View>
	);
};
export default Recipes;
