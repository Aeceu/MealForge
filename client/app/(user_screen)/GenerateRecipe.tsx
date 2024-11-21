import Loading from "@/components/Loading";
import DisplayRecipe from "@/components/modals/DisplayRecipe";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { icons } from "@/constants";
import { useThemeColors } from "@/constants/colors";
import { handleRefresh } from "@/redux/actions/authActions";
import axios from "@/redux/api/axios";
import { RootState, AppDispatch } from "@/redux/store";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Image, RefreshControl, ScrollView, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list-expo";
import { useSelector, useDispatch } from "react-redux";

type recipeProps = {
	name: string;
	ingredients: [
		{
			name: string;
			measurement: string;
		}
	];
	instructions: [string];
	type_of_cuisine: string;
	nutrient_counts: string;
	serve_hot_or_cold: string;
	cooking_time: string;
	benefits: string;
	serve_for: string;
};

const UserPreferences = () => {
	const { ingredients } = useSelector((state: RootState) => state.ingredients);
	const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
	const { colorScheme } = useColorScheme();
	const { textColor, borderColor, inputBgColor } = useThemeColors();
	const [showRecipe, setShowRecipe] = useState<boolean>(false);
	const [darkbg, setdarkbg] = useState<boolean>(false);
	const handleRemove = (ingredient: string) => {
		setSelectedIngredients(
			selectedIngredients.filter((item) => item !== ingredient)
		);
	};
	const [recipeResult, setRecipeResult] = useState<recipeProps | null>(null);

	const handleAddIngredient = (ingredientName: string) => {
		if (selectedIngredients.includes(ingredientName)) {
			return;
		}
		setSelectedIngredients([...selectedIngredients, ingredientName]);
	};

	const dispatch = useDispatch<AppDispatch>();
	const handleGenerate = async () => {
		try {
			const res = await axios.post("/test", {
				ingredients: selectedIngredients,
				user_preference: "",
			});
			console.log(res.data);
			setShowRecipe(true);
			setRecipeResult(res.data);
			setdarkbg(true);
		} catch (error) {
			console.log(error);
		}
	};
	const { pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);

	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	const onClose = () => {
		setRecipeResult(null);
		setdarkbg(false);
		setShowRecipe(false);
	};

	if (pageLoading) return <Loading />;
	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			className="w-full h-screen bg-light dark:bg-dark"
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="flex-col w-full h-full">
				<View className="z-10 flex-1 p-4">
					{/* body */}
					<ScrollView>
						<View className="flex-1 pb-4 space-y-6">
							<View className="space-y-6">
								<StyledText className="mb-2">
									Select your main ingredients
								</StyledText>
								<SelectList
									data={ingredients
										.filter((item) => item.type === "main ingredient")
										.map((item, i) => ({
											key: i,
											value: item.name,
											...item,
										}))}
									save="value"
									setSelected={handleAddIngredient}
									inputStyles={{
										color: textColor,
										fontSize: 14,
										fontFamily: "Poppins-Regular",
									}}
									boxStyles={{
										backgroundColor: inputBgColor,
										borderColor: borderColor,
										borderRadius: 8,
									}}
									dropdownStyles={{
										backgroundColor: inputBgColor,
										borderColor: borderColor,
										borderRadius: 8,
									}}
									dropdownTextStyles={{
										color: textColor,
										fontSize: 14,
										fontFamily: "Poppins-Regular",
									}}
									searchicon={
										<Image
											source={
												colorScheme === "light"
													? icons.searchDarkLight
													: icons.searchLightDark
											}
											resizeMode="contain"
											className="w-4 h-4 mr-2"
										/>
									}
									closeicon={
										<Image
											source={
												colorScheme === "light"
													? icons.closeDarkLight
													: icons.closeLightDark
											}
											resizeMode="contain"
											className="w-5 h-5 ml-2"
										/>
									}
									arrowicon={
										<Image
											source={
												colorScheme === "dark"
													? icons.arrowDownLight
													: icons.arrowDownDark
											}
											resizeMode="contain"
											className="w-4 h-4"
										/>
									}
								/>
								<StyledText className="my-2">
									Select your seasonings
								</StyledText>
								<SelectList
									data={ingredients
										.filter((item) => item.type === "seasoning")
										.map((item, i) => ({
											key: i,
											value: item.name,
											...item,
										}))}
									save="value"
									setSelected={handleAddIngredient}
									inputStyles={{
										color: textColor,
										fontSize: 14,
										fontFamily: "Poppins-Regular",
									}}
									boxStyles={{
										backgroundColor: inputBgColor,
										borderColor: borderColor,
										borderRadius: 8,
									}}
									dropdownStyles={{
										backgroundColor: inputBgColor,
										borderColor: borderColor,
										borderRadius: 8,
									}}
									dropdownTextStyles={{
										color: textColor,
										fontSize: 14,
										fontFamily: "Poppins-Regular",
									}}
									searchicon={
										<Image
											source={
												colorScheme === "light"
													? icons.searchDarkLight
													: icons.searchLightDark
											}
											resizeMode="contain"
											className="w-4 h-4 mr-2"
										/>
									}
									closeicon={
										<Image
											source={
												colorScheme === "light"
													? icons.closeDarkLight
													: icons.closeLightDark
											}
											resizeMode="contain"
											className="w-5 h-5 ml-2"
										/>
									}
									arrowicon={
										<Image
											source={
												colorScheme === "dark"
													? icons.arrowDownLight
													: icons.arrowDownDark
											}
											resizeMode="contain"
											className="w-4 h-4"
										/>
									}
								/>
							</View>
							<View className="flex-col mt-4">
								<StyledText className="" type="heading-4">
									Selected Ingredients:
								</StyledText>
								<View>
									{selectedIngredients.length <= 0 ? (
										<StyledText className="my-4 text-center text-red-500 ">
											No ingredients selected.
										</StyledText>
									) : (
										selectedIngredients.map((item, i) => (
											<View
												key={i}
												className="flex-row items-center justify-between w-full p-4 my-2 bg-white border border-light-border dark:bg-dark-light dark:border-dark-border rounded-xl">
												<View className="flex-col items-start justify-center">
													<StyledText
														key={i}
														className="font-chunk "
														type="heading-5">
														{item}
													</StyledText>
												</View>
												<View className="flex-row items-center justify-center">
													<StyledPressable
														size="icon"
														onPress={() => handleRemove(item)}>
														<Image
															source={
																colorScheme === "light"
																	? icons.closeDarkLight
																	: icons.closeLightDark
															}
															resizeMode="contain"
															className="w-5 h-5"
														/>
													</StyledPressable>
												</View>
											</View>
										))
									)}
								</View>
							</View>
							<View className="flex-row items-center justify-end w-full ">
								<StyledPressable
									onPress={handleGenerate}
									size="xl"
									className="bg-main">
									<StyledText type="subheading" className="text-white">
										Generate Recipe
									</StyledText>
								</StyledPressable>
							</View>
						</View>
					</ScrollView>
				</View>
			</View>

			{darkbg && (
				<View className="absolute w-full h-full bg-black/50 z-[9]"></View>
			)}

			<DisplayRecipe
				isVisible={showRecipe}
				onClose={onClose}
				recipe={recipeResult}
			/>
		</ScrollView>
	);
};
export default UserPreferences;
