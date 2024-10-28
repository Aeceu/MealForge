import { Image, Modal, ScrollView, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";
import { useColorScheme } from "nativewind";
import { icons } from "@/constants";
import { SelectList } from "react-native-dropdown-select-list-expo";
import { useThemeColors } from "@/constants/colors";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type Props = {
	isVisible: boolean;
	onClose: () => void;
};

const GenerateRecipe: React.FC<Props> = ({ isVisible, onClose }) => {
	const { ingredients } = useSelector((state: RootState) => state.ingredients);
	const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
	const { colorScheme } = useColorScheme();
	const { textColor, borderColor, inputBgColor } = useThemeColors();

	const handleRemove = (ingredient: string) => {
		setSelectedIngredients(
			selectedIngredients.filter((item) => item !== ingredient)
		);
	};

	const handleAddIngredient = (ingredientName: string) => {
		if (selectedIngredients.includes(ingredientName)) {
			return;
		}
		setSelectedIngredients([...selectedIngredients, ingredientName]);
	};

	const handleClose = () => {
		setSelectedIngredients([]);
		onClose();
	};

	return (
		<Modal
			visible={isVisible}
			transparent={true}
			animationType="slide"
			className="bg-black">
			<View className="z-10 flex-1">
				<View className="absolute bottom-0 w-full p-4 border bg-light h-[90%] rounded-t-3xl border-light-dark dark:border-dark-light dark:bg-dark">
					{/* header */}
					<View className="flex-row items-center justify-between">
						<StyledText type="heading-4">Generate Recipe</StyledText>
						<StyledPressable onPress={handleClose} size="icon">
							<Image
								source={
									colorScheme === "light"
										? icons.closeDarkLight
										: icons.closeLightDark
								}
								className="w-8 h-8"
							/>
						</StyledPressable>
					</View>

					{/* body */}
					<ScrollView>
						<View className="mt-4 space-y-10">
							<View className="mt-2">
								<View>
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
											<StyledText className="text-center text-red-500 my-4 ">
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
								<View className="w-full flex-row items-center justify-end ">
									<StyledPressable className="bg-main">
										<StyledText className="text-light">
											Generate Recipe
										</StyledText>
									</StyledPressable>
								</View>
							</View>
						</View>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
};
export default GenerateRecipe;
