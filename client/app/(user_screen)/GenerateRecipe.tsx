import { icons } from "@/constants";
import { useState } from "react";
import axios from "@/redux/api/axios";
import { TextInput } from "react-native";
import Loading from "@/components/Loading";
import { useColorScheme } from "nativewind";
import StyledText from "@/components/StyledText";
import { useThemeColors } from "@/constants/colors";
import { cuisineType } from "@/constants/cuisineType";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import DarkBgOverlay from "@/components/DarkBgOverlay";
import StyledPressable from "@/components/StyledPressable";
import { handleRefresh } from "@/redux/actions/authActions";
import DisplayRecipe from "@/components/modals/DisplayRecipe";
import { NewRecipeSchema, TNewRecipe } from "@/utils/types/recipe";
import { SelectList } from "react-native-dropdown-select-list-expo";
import { Image, RefreshControl, ScrollView, View } from "react-native";
import Spin from "@/components/animations/Spin";

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
	nutrient_counts: [
		{
			name: string;
			measurement: string;
		}
	];
	serve_hot_or_cold: string;
	cooking_time: string;
	benefits: string;
	serve_for: string;
	difficulty: string;
};

const UserPreferences = () => {
	const { colorScheme } = useColorScheme();
	const { textColor, borderColor, inputBgColor, placeholderColor } =
		useThemeColors();

	const [darkbg, setdarkbg] = useState<boolean>(false);
	const [showRecipe, setShowRecipe] = useState<boolean>(false);
	const [showOption, setShowOption] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [recipeResult, setRecipeResult] = useState<recipeProps | null>(null);

	const dispatch = useDispatch<AppDispatch>();
	const { user } = useSelector((state: RootState) => state.user);
	const { ingredients } = useSelector((state: RootState) => state.ingredients);
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

	const handleRemove = (fieldName: keyof TNewRecipe, itemToRemove: string) => {
		const currentValues = watch(fieldName) as string[];
		setValue(
			fieldName,
			currentValues.filter((item) => item !== itemToRemove)
		);
	};

	const handleGenerate = async (data: TNewRecipe) => {
		try {
			setLoading(true);
			const res = await axios.post("/generate/recipe", {
				main_ingredients: data.main_ingredients,
				seasonings: data.seasonings,
				user_preference: user?.allergies || "",
				servings: data.servings,
				cuisine_type: data.cuisine_type,
				serve_hot_or_cold: data.serve_hot_or_cold,
				difficulty: data.difficulty,
			});
			console.log(res.data);
			setShowRecipe(true);
			setRecipeResult(res.data);
			setdarkbg(true);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
			reset();
		}
	};

	const {
		watch,
		control,
		handleSubmit,
		setValue,
		formState: { errors },
		reset,
	} = useForm<TNewRecipe>({
		resolver: zodResolver(NewRecipeSchema),
		defaultValues: {
			servings: "1",
			serve_hot_or_cold: "",
			cuisine_type: "",
			difficulty: "Easy",
			main_ingredients: [],
			seasonings: [],
		},
	});

	if (pageLoading) return <Loading />;

	return (
		<>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				className="w-full h-screen bg-light dark:bg-dark"
				refreshControl={
					<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
				}>
				<View className="z-10 flex-col flex-1 w-full h-full p-4">
					<View className="flex-1 pb-4 space-y-6">
						<View className="space-y-4">
							{/* Add main ingredients */}
							<View>
								<StyledText className="mb-2">
									Select your main ingredients
								</StyledText>
								<Controller
									control={control}
									name="main_ingredients"
									defaultValue={[]}
									render={({ field: { onChange, value } }) => (
										<SelectList
											data={ingredients
												.filter((item) => item.type === "main ingredient")
												.map((item, i) => ({
													key: i,
													value: `${item.name} ${item.is_expired ? "(expired)" : ""
														}`,
													type: "main ingredient",
												}))}
											save="value"
											setSelected={(selectedValue: string) => {
												if (!value.includes(selectedValue)) {
													onChange([...value, selectedValue.split("(")[0]]);
												}
											}}
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
									)}
								/>
								{errors.main_ingredients && (
									<StyledText
										fontStyle="default"
										className="mt-2 ml-3 text-sm text-red-500">
										* {errors.main_ingredients.message}
									</StyledText>
								)}
							</View>

							{/* Add seasonings */}
							<View>
								<StyledText className="mb-2">Select your seasonings</StyledText>
								<Controller
									control={control}
									name="seasonings"
									defaultValue={[]}
									render={({ field: { onChange, value } }) => (
										<SelectList
											data={ingredients
												.filter((item) => item.type === "seasoning")
												.map((item, i) => ({
													key: i,
													value: `${item.name} ${item.is_expired ? "(expired)" : ""
														}`,
													type: "seasonings",
												}))}
											save="value"
											setSelected={(selectedValue: string) => {
												if (!value.includes(selectedValue)) {
													onChange([...value, selectedValue]);
												}
											}}
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
									)}
								/>
								{errors.seasonings && (
									<StyledText
										fontStyle="default"
										className="mt-2 ml-3 text-sm text-red-500">
										* {errors.seasonings.message}
									</StyledText>
								)}
							</View>

							{showOption && (
								<>
									{/* Serve for how many people */}
									<View className="mt-4">
										<View className="flex-row items-center mb-2">
											<StyledText className="">Servings</StyledText>
											{errors.servings && (
												<StyledText
													fontStyle="default"
													className="ml-3 text-sm text-red-500">
													* {errors.servings.message}
												</StyledText>
											)}
										</View>
										<View className="flex-row items-center w-full">
											<Image
												source={
													colorScheme === "light"
														? icons.usersDark
														: icons.usersLight
												}
												resizeMode="contain"
												className="mt-1 w-7 h-7"
											/>
											<Controller
												control={control}
												name="servings"
												render={({ field: { value, onChange } }) => (
													<TextInput
														value={value}
														onChangeText={onChange}
														placeholderTextColor={placeholderColor}
														className={`
                            w-full flex-1 ml-2 border border-light-border font-pregular dark:border-dark-border bg-white dark:bg-dark-light text-dark dark:text-main-50 rounded-lg px-6 py-2 text-sm
                            `}
														keyboardType="numeric" // Show numeric keyboard
														maxLength={10} // Optional: Limit number of characters
														placeholder="1, 2, 3..."
													/>
												)}
											/>
										</View>
									</View>

									{/* Cuisine type */}
									<View className="mt-4">
										<View className="flex-row items-center mb-2">
											<StyledText className="">Cuisine type</StyledText>
											{errors.cuisine_type && (
												<StyledText
													fontStyle="default"
													className="ml-3 text-sm text-red-500">
													* {errors.cuisine_type.message}
												</StyledText>
											)}
										</View>
										<View className="flex-row items-start w-full">
											<Image
												source={
													colorScheme === "light"
														? icons.cuisineTypeDark
														: icons.cuisineTypeLight
												}
												resizeMode="contain"
												className="mt-2 w-7 h-7"
											/>
											<Controller
												control={control}
												name="cuisine_type"
												render={({ field: { onChange } }) => (
													<View className="flex-1 w-full ml-2 ">
														<SelectList
															data={cuisineType}
															save="value"
															setSelected={onChange}
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
												)}
											/>
										</View>
									</View>

									{/* Serve hot or cold */}
									<View className="mt-4">
										<View className="flex-row items-center mb-2">
											<StyledText className="">Serve hot or cold</StyledText>
											{errors.serve_hot_or_cold && (
												<StyledText
													fontStyle="default"
													className="ml-3 text-sm text-red-500">
													* {errors.serve_hot_or_cold.message}
												</StyledText>
											)}
										</View>
										<View className="flex-row items-start w-full">
											<Image
												source={
													colorScheme === "light"
														? icons.tempDark
														: icons.tempLight
												}
												resizeMode="contain"
												className="mt-2 w-7 h-7"
											/>
											<Controller
												control={control}
												name="serve_hot_or_cold"
												render={({ field: { onChange } }) => (
													<View className="flex-1 ml-3 w-max">
														<SelectList
															data={[
																{ key: 1, value: "Hot" },
																{ key: 2, value: "Cold" },
															]}
															save="value"
															setSelected={onChange}
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
												)}
											/>
										</View>
									</View>

									{/* Difficulty level */}
									<View className="mt-4">
										<View className="flex-row items-center mb-2">
											<StyledText className="">Difficulty level</StyledText>
											{errors.difficulty && (
												<StyledText
													fontStyle="default"
													className="ml-3 text-sm text-red-500">
													* {errors.difficulty.message}
												</StyledText>
											)}
										</View>
										<View className="flex-row items-start w-full">
											<Image
												source={
													colorScheme === "light"
														? icons.diffDark
														: icons.diffLight
												}
												resizeMode="contain"
												className="mt-2 w-7 h-7"
											/>
											<Controller
												control={control}
												name="difficulty"
												render={({ field: { onChange } }) => (
													<View className="flex-1 ml-3 w-max">
														<SelectList
															data={[
																{ key: 1, value: "Easy" },
																{ key: 2, value: "Medium" },
																{ key: 3, value: "Hard" },
															]}
															save="value"
															setSelected={onChange}
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
												)}
											/>
										</View>
									</View>
								</>
							)}

							<View className="flex-row items-center justify-center w-full">
								<View className="flex-1 w-full h-[1px] bg-dark-border rounded-full" />
								<StyledPressable
									size="icon"
									onPress={() => setShowOption((prev) => !prev)}>
									<StyledText className="mx-4" type="xs">
										{showOption ? "Hide options" : "More options"}
									</StyledText>
								</StyledPressable>
								<View className="flex-1 w-full h-[1px] bg-dark-border rounded-full" />
							</View>
						</View>

						{/* Display all selected ingredients and seasonings */}
						<View className="flex-col mt-4">
							{/* Main Ingredients Section */}
							<StyledText className="" type="heading-4">
								Selected Main Ingredients:
							</StyledText>
							<View>
								{watch("main_ingredients")?.length <= 0 ? (
									<StyledText className="my-4 text-center text-red-500">
										No main ingredients selected.
									</StyledText>
								) : (
									watch("main_ingredients").map((item, i) => (
										<View
											key={`main-ingredient-${i}`}
											className="flex-row items-center justify-between w-full p-4 my-2 bg-white border border-light-border dark:bg-dark-light dark:border-dark-border rounded-xl">
											<View className="flex-col items-start justify-center">
												<StyledText className="font-chunk" type="heading-5">
													{item}
												</StyledText>
											</View>
											<View className="flex-row items-center justify-center">
												<StyledPressable
													size="icon"
													onPress={() =>
														handleRemove("main_ingredients", item)
													}>
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

							{/* Seasonings Section */}
							<StyledText className="mt-6" type="heading-4">
								Selected Seasonings:
							</StyledText>
							<View>
								{watch("seasonings")?.length <= 0 ? (
									<StyledText className="my-4 text-center text-red-500">
										No seasonings selected.
									</StyledText>
								) : (
									watch("seasonings").map((item, i) => (
										<View
											key={`seasoning-${i}`}
											className="flex-row items-center justify-between w-full p-4 my-2 bg-white border border-light-border dark:bg-dark-light dark:border-dark-border rounded-xl">
											<View className="flex-col items-start justify-center">
												<StyledText className="font-chunk" type="heading-5">
													{item}
												</StyledText>
											</View>
											<View className="flex-row items-center justify-center">
												<StyledPressable
													size="icon"
													onPress={() => handleRemove("seasonings", item)}>
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
								disabled={loading}
								onPress={handleSubmit(handleGenerate)}
								size="xl"
								className="bg-main">
								{loading ? (
									<View className="flex items-center justify-center">
										<Spin size="sm" loading={loading} />
									</View>
								) : (
									<StyledText type="subheading" className="text-white">
										Generate Recipe
									</StyledText>
								)}
							</StyledPressable>
						</View>
					</View>
				</View>
			</ScrollView>

			{darkbg && <DarkBgOverlay />}

			<DisplayRecipe
				isVisible={showRecipe}
				onClose={onClose}
				recipe={recipeResult}
			/>
		</>
	);
};
export default UserPreferences;
