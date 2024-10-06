import { Image, Modal, TextInput, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";
import { SelectList } from "react-native-dropdown-select-list-expo";
import { useState } from "react";
import { mainIngredients, seasonings } from "@/constants/ingredients";
import { icons } from "@/constants";
import { useThemeColors } from "@/constants/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type Props = {
	isVisible: boolean;
	onClose: () => void;
};

const AddIngredients: React.FC<Props> = ({ isVisible, onClose }) => {
	const [type, setType] = useState("");
	const { textColor } = useThemeColors();
	const [selected, setSelected] = useState("");
	const [showDate, setShowDate] = useState(false);

	const handleClose = () => {
		setSelected("");
		setType("");
		onClose();
	};

	const handleConfirm = (date: Date) => {
		console.warn("A date has been picked: ", date);
		setShowDate(false);
	};

	return (
		<Modal visible={isVisible} transparent={true} animationType="slide">
			<View className="absolute bottom-0 w-full h-3/4 rounded-t-3xl border border-light-dark dark:border-dark-light p-4 bg-light dark:bg-dark-light">
				{/* header */}
				<View className="flex-row items-center justify-between">
					<StyledText className="">Add new ingredient</StyledText>
					<StyledPressable
						onPress={handleClose}
						size="sm"
						className="bg-main rounded-md">
						<StyledText type="label">Close</StyledText>
					</StyledPressable>
				</View>

				{/* body */}
				<View className="mt-4">
					<View className="w-1/2 ">
						<StyledText type="label" className="mb-2">
							Type of ingredient
						</StyledText>
						<SelectList
							data={[
								{ key: "1", value: "main ingredient" },
								{ key: "1", value: "seasoning" },
							]}
							save="value"
							onSelect={() => setSelected("")}
							setSelected={(val: string) => setType(val)}
							inputStyles={{
								color: textColor,
							}}
							boxStyles={{
								borderColor: textColor,
							}}
							dropdownStyles={{
								borderColor: textColor,
							}}
							dropdownTextStyles={{
								color: textColor,
							}}
							searchicon={
								<Image
									source={icons.searchLightDark}
									resizeMode="contain"
									className="w-4 h-4"
								/>
							}
							closeicon={
								<Image
									source={icons.closeLightDark}
									resizeMode="contain"
									className="w-5 h-5"
								/>
							}
							searchPlaceholder=""
						/>
					</View>

					{type && (
						<View className="mt-2">
							<View>
								<StyledText type="label" className="mb-2">
									Select an ingredient
								</StyledText>
								<SelectList
									data={
										type === "main ingredient" ? mainIngredients : seasonings
									}
									save="value"
									setSelected={(val: string) => setSelected(val)}
									inputStyles={{
										color: textColor,
									}}
									boxStyles={{
										borderColor: textColor,
									}}
									dropdownStyles={{
										borderColor: textColor,
									}}
									dropdownTextStyles={{
										color: textColor,
									}}
									searchicon={
										<Image
											source={icons.searchLightDark}
											resizeMode="contain"
											className="w-4 h-4"
										/>
									}
									closeicon={
										<Image
											source={icons.closeLightDark}
											resizeMode="contain"
											className="w-5 h-5"
										/>
									}
									searchPlaceholder=""
								/>
							</View>
							<View className="mt-2">
								<StyledText type="label" className="mb-2">
									Measurements
								</StyledText>
								<TextInput
									className="border border-lighr-dark dark:border-main-50 rounded-lg p-2 text-dark dark:text-main-50"
									placeholderTextColor={textColor}
									placeholder="ex. 1/2 kg, 1ml, 1tbsp"
								/>
							</View>
							<View className="mt-2">
								<StyledText type="label" className="mb-2">
									Expiration Date?
								</StyledText>
								<StyledPressable
									className="bg-main"
									onPress={() => setShowDate(true)}>
									<StyledText>Select Date</StyledText>
								</StyledPressable>

								<DateTimePickerModal
									isVisible={showDate}
									mode="date"
									onConfirm={handleConfirm}
									onCancel={() => setShowDate(false)}
								/>
							</View>
						</View>
					)}
				</View>
			</View>
		</Modal>
	);
};

export default AddIngredients;
