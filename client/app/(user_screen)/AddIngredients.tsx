import { Alert, Image, ScrollView, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { icons } from "@/constants";
import { useThemeColors } from "@/constants/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Controller, useForm } from "react-hook-form";
import { IngredientSchema, TNewIngredients } from "@/utils/types/ingredients";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addIngredients } from "@/redux/actions/ingredientsAction";
import { useColorScheme } from "nativewind";
import Spin from "@/components/animations/Spin";
import StyledText from "@/components/StyledText";
import StyledPressable from "@/components/StyledPressable";
import { ingredients } from "@/constants/new_unique_ner";
import { SelectList } from "react-native-dropdown-select-list-expo";
import axios from "@/redux/api/axios";

const AddIngredients = () => {
	const [showDate, setShowDate] = useState(false);
	const [addExpirationDate, setAddExpirationDate] = useState(false);

	const { colorScheme } = useColorScheme();
	const { textColor, borderColor, placeholderColor, inputBgColor } =
		useThemeColors();

	const dispatch = useDispatch<AppDispatch>();
	const { user } = useSelector((state: RootState) => state.user);

	const [loading, setLoading] = useState(false);
	const [selectedIngredients, setSelectedIngredients] = useState("");
	const [ingredientResult, setIngredientResult] = useState<string[]>([]);
	const [recommendedIngredients, setRecommendedIngredients] = useState<
		string[]
	>([]);

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
		setValue,
	} = useForm<TNewIngredients>({
		resolver: zodResolver(IngredientSchema),
	});

	const onSubmit = async (data: TNewIngredients) => {
		if (!user?.id) return;
		dispatch(
			addIngredients({
				name: data.name,
				type: data.type,
				expirationDate: data.expirationDate,
				measurements: data.measurements,
				userId: user.id,
			})
		).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				reset();
				Alert.alert(res.payload.message);
			}
		});
	};

	const handleSetValue = async (value: string) => {
		setValue("name", value);
		setIngredientResult([]);
		setRecommendedIngredients([]);
		try {
			const res = await axios.get(`/user/ingredients/recommend/${value}`);
			setRecommendedIngredients(res.data.recommended_ingredients);
			console.log(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		let debounceTimeout: NodeJS.Timeout;

		if (selectedIngredients) {
			setLoading(true);
			setRecommendedIngredients([]);
			setIngredientResult([]);
			debounceTimeout = setTimeout(() => {
				const filtered = ingredients.filter(
					(item) =>
						item.toString().toLowerCase() === selectedIngredients.toLowerCase()
				);
				setIngredientResult(filtered);
				setLoading(false);
			}, 500);
		} else {
			setIngredientResult([]);
			setLoading(false);
		}
		return () => {
			if (debounceTimeout) clearTimeout(debounceTimeout);
		};
	}, [selectedIngredients, dispatch]);

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<View className="bg-light  dark:bg-dark p-4  w-full h-full">
				{/* body */}
				<View className="">
					<View className="">
						<View className="">
							<StyledText type="heading-3" className="mb-2">
								Search an ingredient
							</StyledText>
							<TextInput
								value={selectedIngredients}
								onChangeText={(e) => setSelectedIngredients(e)}
								className={`
                      border border-light-border font-pregular dark:border-dark-border bg-white dark:bg-dark-light text-dark dark:text-main-50 rounded-lg px-6 py-2 text-sm
                      `}
								placeholderTextColor={placeholderColor}
								placeholder="search for ingredient"
							/>

							{/* Recommended badge! */}
							{recommendedIngredients.length > 0 && (
								<ScrollView
									horizontal
									showsHorizontalScrollIndicator={false}
									className="w-full mt-4">
									<View className="flex-row items-center justify-center w-full  space-x-2">
										<StyledText type="xs">Recommended:</StyledText>
										{recommendedIngredients.map((item, i) => (
											<StyledPressable
												size="text"
												key={i}
												onPress={() => handleSetValue(item)}>
												<StyledText
													type="label"
													className="px-3 bg-light border border-light-border dark:border-dark-border dark:bg-dark py-1.5 rounded-full">
													{item}
												</StyledText>
											</StyledPressable>
										))}
									</View>
								</ScrollView>
							)}

							{errors.name && (
								<StyledText
									fontStyle="default"
									className="px-1 text-sm text-red-500">
									{errors.name.message}
								</StyledText>
							)}

							{loading ? (
								<View className="flex items-center justify-center mt-2 ">
									<Spin size="sm" loading={loading} />
								</View>
							) : (
								ingredientResult.length > 0 && (
									<View className="w-full h-full flex-col mt-2">
										{ingredientResult.map((item, i) => (
											<StyledPressable
												key={i}
												size="text"
												className="my-2 rounded-lg border border-light-border dark:border-dark-border bg-light dark:bg-dark p-4"
												onPress={() => handleSetValue(item)}>
												<StyledText>{item}</StyledText>
											</StyledPressable>
										))}
									</View>
								)
							)}
						</View>

						{watch().name && (
							<>
								<View className="mt-4">
									<StyledText type="label" className="mb-2">
										Type
									</StyledText>
									<Controller
										control={control}
										name="type"
										render={({ field: { onChange } }) => (
											<SelectList
												data={[
													{ key: 1, value: "main ingredient" },
													{ key: 2, value: "seasoning" },
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
										)}
									/>
									{errors.type && (
										<StyledText
											fontStyle="default"
											className="px-1 text-sm text-red-500">
											{errors.type.message}
										</StyledText>
									)}
								</View>
								<View className="mt-4">
									<StyledText type="label" className="mb-2">
										Measurements
									</StyledText>
									<Controller
										control={control}
										name="measurements"
										render={({ field: { value, onChange } }) => (
											<TextInput
												value={value}
												onChangeText={onChange}
												className={`
                        border border-light-border font-pregular dark:border-dark-border bg-white dark:bg-dark-light text-dark dark:text-main-50 rounded-lg px-6 py-2 text-sm
                        `}
												placeholderTextColor={placeholderColor}
												placeholder="ex. 1/2 kg, 1ml, 1tbsp"
											/>
										)}
									/>
									{errors.measurements && (
										<StyledText
											fontStyle="default"
											className="px-1 text-sm text-red-500">
											{errors.measurements.message}
										</StyledText>
									)}
								</View>

								<View className="mt-4">
									<StyledText type="label" className="mb-2">
										Expiration Date
									</StyledText>

									{addExpirationDate ? (
										<View className="flex-row items-center w-full">
											<Controller
												control={control}
												name="expirationDate"
												render={({ field: { value, onChange } }) => (
													<View className="flex-1">
														<StyledPressable
															className="w-full bg-white border rounded-lg dark:bg-dark-light border-light-border dark:border-dark-border"
															onPress={() => setShowDate(true)}>
															<StyledText className="w-full px-6 text-sm font-pregular text-start">
																{watch("expirationDate")
																	? String(value)
																	: "Select Date"}
															</StyledText>
														</StyledPressable>
														<DateTimePickerModal
															isVisible={showDate}
															mode="date"
															onConfirm={onChange}
															onCancel={() => {
																setShowDate(false);
															}}
														/>
													</View>
												)}
											/>
											<StyledPressable
												size="icon"
												className="ml-2"
												onPress={() => setAddExpirationDate(false)}>
												<Image
													source={
														colorScheme === "light"
															? icons.closeDarkLight
															: icons.closeLightDark
													}
													resizeMode="contain"
													className="w-8 h-8"
												/>
											</StyledPressable>
										</View>
									) : (
										<StyledPressable
											onPress={() => setAddExpirationDate(true)}
											className="w-full border border-main">
											<StyledText className="text-main" type="paragraph">
												Add Date
											</StyledText>
										</StyledPressable>
									)}
								</View>
							</>
						)}
					</View>

					{watch().name && watch().measurements && watch().type && (
						<View>
							<StyledPressable
								size="xl"
								className={`mt-10 bg-main flex-row items-center`}
								onPress={handleSubmit(onSubmit)}>
								<StyledText
									className="text-white dark:text-main-50"
									selectable={false}
									type="subheading">
									Save
								</StyledText>
							</StyledPressable>
						</View>
					)}
				</View>
			</View>
		</ScrollView>
	);
};
export default AddIngredients;
