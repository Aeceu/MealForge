import { Alert, Image, Modal, TextInput, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";
import { SelectList } from "react-native-dropdown-select-list-expo";
import { useState } from "react";
import { mainIngredients, seasonings } from "@/constants/ingredients";
import { icons } from "@/constants";
import { useThemeColors } from "@/constants/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Controller, useForm } from "react-hook-form";
import { IngredientSchema, TNewIngredients } from "@/utils/types/ingredients";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addIngredients } from "@/redux/actions/ingredientsAction";

type Props = {
	type: "main ingredient" | "seasoning";
	isVisible: boolean;
	onClose: () => void;
};

const AddIngredients: React.FC<Props> = ({ type, isVisible, onClose }) => {
	const { textColor } = useThemeColors();
	const [showDate, setShowDate] = useState(false);

	const handleClose = () => {
		onClose();
		reset();
	};

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm<TNewIngredients>({
		resolver: zodResolver(IngredientSchema),
	});

	const { user } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch<AppDispatch>();
	const onSubmit = async (data: TNewIngredients) => {
		if (!user?.id) return;
		dispatch(
			addIngredients({
				name: data.name,
				type: type,
				expirationDate: data.expirationDate,
				measurements: data.measurements,
				userId: user.id,
			})
		).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				reset();
				Alert.alert(res.payload.message);
				onClose();
			}
		});
	};

	return (
		<Modal
			visible={isVisible}
			transparent={true}
			animationType="slide"
			className="bg-red-500">
			<View className="flex-1">
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
						<View className="mt-2">
							<View>
								<StyledText type="label" className="mb-2">
									Select an ingredient
								</StyledText>
								<Controller
									control={control}
									name="name"
									render={({ field: { onChange } }) => (
										<SelectList
											data={
												type === "main ingredient"
													? mainIngredients
													: seasonings
											}
											save="value"
											setSelected={onChange}
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
									)}
								/>
								{errors.name && (
									<StyledText
										fontStyle="default"
										className="px-1 text-sm text-red-500">
										{errors.name.message}
									</StyledText>
								)}
							</View>

							<View className="mt-2">
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
                        border border-light-dark dark:border-main-50 text-dark dark:text-main-50 rounded-lg px-6 py-2.5 text-[15px]
                        `}
											placeholderTextColor={textColor}
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

							<View className="mt-2">
								<StyledText type="label" className="mb-2">
									Expiration Date?
								</StyledText>
								<Controller
									control={control}
									name="expirationDate"
									render={({ field: { value, onChange } }) => (
										<>
											<StyledPressable
												className="bg-main w-full"
												onPress={() => setShowDate(true)}>
												<StyledText>
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
										</>
									)}
								/>
								{errors.expirationDate && (
									<StyledText
										fontStyle="default"
										className="px-1 text-sm text-red-500">
										{errors.expirationDate.message}
									</StyledText>
								)}
							</View>
						</View>
						<View>
							<StyledPressable
								size="xl"
								className={`mt-4 bg-main flex-row items-center`}
								onPress={handleSubmit(onSubmit)}>
								<StyledText
									className="ml-2"
									selectable={false}
									fontStyle="Chunk"
									type="button">
									Save
								</StyledText>
							</StyledPressable>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default AddIngredients;
