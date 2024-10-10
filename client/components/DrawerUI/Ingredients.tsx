import { Image, ScrollView, View } from "react-native";
import StyledText from "../StyledText";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { getIngredients } from "@/redux/actions/ingredientsAction";
import { icons, images } from "@/constants";
import StyledPressable from "../StyledPressable";
import Pulse from "../animations/Pulse";
import { useColorScheme } from "nativewind";

const Ingredients = () => {
	const { ingredients, status, user } = useSelector(
		(state: RootState) => state.user
	);

	const { colorScheme } = useColorScheme();

	if (status == "pending") {
		return (
			<View className="w-full p-8 flex-col items-center justify-center bg-light dark:bg-dark">
				<Pulse>
					<Image
						source={
							colorScheme === "dark"
								? images.loading_light
								: images.loading_dark
						}
						resizeMode="contain"
						className="w-20 h-20"
					/>
				</Pulse>
			</View>
		);
	}

	return (
		<ScrollView className="flex-1 w-full h-full p-4 ">
			{ingredients.length > 0 ? (
				ingredients.map((item, i) => (
					<View
						key={i}
						className="w-full p-4 my-2 bg-white border border-light-border dark:bg-dark-light dark:border-dark-border rounded-xl flex-row items-center justify-between">
						<View className="flex-col items-start justify-center">
							<StyledText type="label" className="text-xs">
								{item.type}
							</StyledText>
							<StyledText key={i} className="font-chunk " type="heading-4">
								{item.name}
							</StyledText>
							<StyledText type="label" className="text-xs">
								{item.measurements}
							</StyledText>
						</View>
						<View className="flex-row items-center justify-center">
							<StyledPressable size="icon">
								<Image
									source={icons.editLightDark}
									resizeMode="contain"
									className="w-5 h-5"
								/>
							</StyledPressable>
							<StyledPressable size="icon">
								<Image
									source={icons.closeLightDark}
									resizeMode="contain"
									className="w-7 h-7"
								/>
							</StyledPressable>
						</View>
					</View>
				))
			) : (
				<StyledText>No Ingredients is added!</StyledText>
			)}
		</ScrollView>
	);
};

export default Ingredients;
