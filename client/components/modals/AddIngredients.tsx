// import { Alert, Image, Modal, ScrollView, TextInput, View } from "react-native";
// import StyledText from "../StyledText";
// import StyledPressable from "../StyledPressable";
// import { SelectList } from "react-native-dropdown-select-list-expo";
// import { useEffect, useState } from "react";
// import { mainIngredients, seasonings } from "@/constants/ingredients";
// import { icons } from "@/constants";
// import { useThemeColors } from "@/constants/colors";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { Controller, useForm } from "react-hook-form";
// import { IngredientSchema, TNewIngredients } from "@/utils/types/ingredients";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/redux/store";
// import { addIngredients } from "@/redux/actions/ingredientsAction";
// import { useColorScheme } from "nativewind";
// import { ingredients } from "@/constants/new_ingredients";
// import Spin from "../animations/Spin";

// type Props = {
// 	type: "main ingredient" | "seasoning";
// 	isVisible: boolean;
// 	onClose: () => void;
// };

// type TIngredientResult = {
// 	key: number;
// 	value: string;
// };

// const AddIngredients: React.FC<Props> = ({ type, isVisible, onClose }) => {
// 	const [showDate, setShowDate] = useState(false);
// 	const [addExpirationDate, setAddExpirationDate] = useState(false);

// 	const { colorScheme } = useColorScheme();
// 	const { textColor, borderColor, placeholderColor, inputBgColor } =
// 		useThemeColors();

// 	const dispatch = useDispatch<AppDispatch>();
// 	const { user } = useSelector((state: RootState) => state.user);

// 	const [loading, setLoading] = useState(false);
// 	const [selectedIngredients, setSelectedIngredients] = useState("");
// 	const [ingredientResult, setIngredientResult] = useState<TIngredientResult[]>(
// 		[]
// 	);

// 	const {
// 		control,
// 		handleSubmit,
// 		formState: { errors },
// 		reset,
// 		watch,
// 	} = useForm<TNewIngredients>({
// 		resolver: zodResolver(IngredientSchema),
// 	});

// 	const handleClose = () => {
// 		onClose();
// 		reset();
// 	};

// 	const onSubmit = async (data: TNewIngredients) => {
// 		if (!user?.id) return;
// 		dispatch(
// 			addIngredients({
// 				name: data.name,
// 				type: type,
// 				expirationDate: data.expirationDate,
// 				measurements: data.measurements,
// 				userId: user.id,
// 			})
// 		).then((res) => {
// 			if (res.meta.requestStatus === "fulfilled") {
// 				reset();
// 				Alert.alert(res.payload.message);
// 				onClose();
// 			}
// 		});
// 	};

// 	useEffect(() => {
// 		let debounceTimeout: NodeJS.Timeout;

// 		if (selectedIngredients) {
// 			setLoading(true);
// 			debounceTimeout = setTimeout(() => {
// 				const filtered = ingredients.filter((item) =>
// 					Object.values(item).some((value) =>
// 						value
// 							.toString()
// 							.toLowerCase()
// 							.includes(selectedIngredients.toLowerCase())
// 					)
// 				);
// 				setIngredientResult(filtered);
// 				setLoading(false);
// 			}, 500);
// 		} else {
// 			setIngredientResult([]);
// 			setLoading(false);
// 		}
// 		return () => {
// 			if (debounceTimeout) clearTimeout(debounceTimeout);
// 		};
// 	}, [selectedIngredients, dispatch]);

// 	return (
// 		<Modal
// 			visible={isVisible}
// 			transparent={true}
// 			animationType="slide"
// 			className="bg-black">
// 			<View className="z-10 flex-1">
// 				<View className="absolute bottom-0 w-full p-4 border bg-light h-3/4 rounded-t-3xl border-light-dark dark:border-dark-light dark:bg-dark">
// 					{/* header */}
// 					<View className="flex-row items-center justify-between">
// 						<StyledText type="heading-4">
// 							Add new {type === "main ingredient" ? "ingredient" : "seasoning"}
// 						</StyledText>
// 						<StyledPressable onPress={handleClose} size="text">
// 							<StyledText type="xs" className="underline">
// 								Close
// 							</StyledText>
// 						</StyledPressable>
// 					</View>

// 					{/* body */}
// 					<View className="mt-4">
// 						<View className="">
// 							<View className="">
// 								<StyledText type="label" className="mb-2">
// 									Select an ingredient
// 								</StyledText>
// 								<TextInput
// 									value={selectedIngredients}
// 									onChangeText={(e) => setSelectedIngredients(e)}
// 									className={`
//                       border border-light-border font-pregular dark:border-dark-border bg-white dark:bg-dark-light text-dark dark:text-main-50 rounded-lg px-6 py-2 text-sm
//                       `}
// 									placeholderTextColor={placeholderColor}
// 									placeholder="search for ingredient"
// 								/>

// 								{errors.name && (
// 									<StyledText
// 										fontStyle="default"
// 										className="px-1 text-sm text-red-500">
// 										{errors.name.message}
// 									</StyledText>
// 								)}

// 								{loading ? (
// 									<View className="flex items-center justify-center mt-2 ">
// 										<Spin size="sm" loading={loading} />
// 									</View>
// 								) : ingredientResult.length > 0 ? (
// 									<ScrollView
// 										className="w-full h-[300px] mt-4"
// 										contentContainerStyle={{ flexGrow: 1 }}>
// 										<View className="w-full h-full flex-col">
// 											{ingredientResult.map((item, i) => (
// 												<StyledText key={i}>{item.value}</StyledText>
// 											))}
// 										</View>
// 									</ScrollView>
// 								) : (
// 									<StyledText className="mt-4">
// 										No ingredients is search.
// 									</StyledText>
// 								)}
// 							</View>

// 							{watch().name && (
// 								<>
// 									<View className="mt-4">
// 										<StyledText type="label" className="mb-2">
// 											Measurements
// 										</StyledText>
// 										<Controller
// 											control={control}
// 											name="measurements"
// 											render={({ field: { value, onChange } }) => (
// 												<TextInput
// 													value={value}
// 													onChangeText={onChange}
// 													className={`
//                         border border-light-border font-pregular dark:border-dark-border bg-white dark:bg-dark-light text-dark dark:text-main-50 rounded-lg px-6 py-2 text-sm
//                         `}
// 													placeholderTextColor={placeholderColor}
// 													placeholder="ex. 1/2 kg, 1ml, 1tbsp"
// 												/>
// 											)}
// 										/>
// 										{errors.measurements && (
// 											<StyledText
// 												fontStyle="default"
// 												className="px-1 text-sm text-red-500">
// 												{errors.measurements.message}
// 											</StyledText>
// 										)}
// 									</View>

// 									<View className="mt-4">
// 										<StyledText type="label" className="mb-2">
// 											Expiration Date
// 										</StyledText>

// 										{addExpirationDate ? (
// 											<View className="flex-row items-center w-full">
// 												<Controller
// 													control={control}
// 													name="expirationDate"
// 													render={({ field: { value, onChange } }) => (
// 														<View className="flex-1">
// 															<StyledPressable
// 																className="w-full bg-white border rounded-lg dark:bg-dark-light border-light-border dark:border-dark-border"
// 																onPress={() => setShowDate(true)}>
// 																<StyledText className="w-full px-6 text-sm font-pregular text-start">
// 																	{watch("expirationDate")
// 																		? String(value)
// 																		: "Select Date"}
// 																</StyledText>
// 															</StyledPressable>
// 															<DateTimePickerModal
// 																isVisible={showDate}
// 																mode="date"
// 																onConfirm={onChange}
// 																onCancel={() => {
// 																	setShowDate(false);
// 																}}
// 															/>
// 														</View>
// 													)}
// 												/>
// 												<StyledPressable
// 													size="icon"
// 													className="ml-2"
// 													onPress={() => setAddExpirationDate(false)}>
// 													<Image
// 														source={
// 															colorScheme === "light"
// 																? icons.closeDarkLight
// 																: icons.closeLightDark
// 														}
// 														resizeMode="contain"
// 														className="w-8 h-8"
// 													/>
// 												</StyledPressable>
// 											</View>
// 										) : (
// 											<StyledPressable
// 												onPress={() => setAddExpirationDate(true)}
// 												className="w-full border border-main">
// 												<StyledText className="text-main" type="paragraph">
// 													Add Date
// 												</StyledText>
// 											</StyledPressable>
// 										)}
// 									</View>
// 								</>
// 							)}
// 						</View>
// 						<View>
// 							<StyledPressable
// 								size="xl"
// 								className={`mt-10 bg-main flex-row items-center`}
// 								onPress={handleSubmit(onSubmit)}>
// 								<StyledText
// 									className="text-white dark:text-main-50"
// 									selectable={false}
// 									type="subheading">
// 									Save
// 								</StyledText>
// 							</StyledPressable>
// 						</View>
// 					</View>
// 				</View>
// 			</View>
// 		</Modal>
// 	);
// };

// export default AddIngredients;

// {
// 	/* <View className="">
// 	<StyledText type="label" className="mb-2">
// 		Select an ingredient
// 	</StyledText>
// 	<Controller
// 		control={control}
// 		name="name"
// 		render={({ field: { onChange } }) => (
// 			<SelectList
// 				data={ingredients}
// 				save="value"
// 				setSelected={onChange}
// 				inputStyles={{
// 					color: textColor,
// 					fontSize: 14,
// 					fontFamily: "Poppins-Regular",
// 				}}
// 				boxStyles={{
// 					backgroundColor: inputBgColor,
// 					borderColor: borderColor,
// 					borderRadius: 8,
// 				}}
// 				dropdownStyles={{
// 					backgroundColor: inputBgColor,
// 					borderColor: borderColor,
// 					borderRadius: 8,
// 				}}
// 				dropdownTextStyles={{
// 					color: textColor,
// 					fontSize: 14,
// 					fontFamily: "Poppins-Regular",
// 				}}
// 				searchicon={
// 					<Image
// 						source={
// 							colorScheme === "light"
// 								? icons.searchDarkLight
// 								: icons.searchLightDark
// 						}
// 						resizeMode="contain"
// 						className="w-4 h-4 mr-2"
// 					/>
// 				}
// 				closeicon={
// 					<Image
// 						source={
// 							colorScheme === "light"
// 								? icons.closeDarkLight
// 								: icons.closeLightDark
// 						}
// 						resizeMode="contain"
// 						className="w-6 h-6 ml-2"
// 					/>
// 				}
// 				arrowicon={
// 					<Image
// 						source={
// 							colorScheme === "dark"
// 								? icons.arrowDownLight
// 								: icons.arrowDownDark
// 						}
// 						resizeMode="contain"
// 						className="w-6 h-6"
// 					/>
// 				}
// 			/>
// 		)}
// 	/>
// 	{errors.name && (
// 		<StyledText fontStyle="default" className="px-1 text-sm text-red-500">
// 			{errors.name.message}
// 		</StyledText>
// 	)}
// </View>; */
// }
