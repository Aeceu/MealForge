import { Alert, Image, Modal, StyleSheet, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";
import { useColorScheme } from "nativewind";
import { icons } from "@/constants";
import { SelectList } from "react-native-dropdown-select-list-expo";
import { useThemeColors } from "@/constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useState } from "react";
import { TRecipe } from "@/utils/types/recipe";
import { createPost } from "@/redux/actions/postAction";
import Spin from "../animations/Spin";

type Props = {
	isVisible: boolean;
	onClose: () => void;
};

const CreatePost: React.FC<Props> = ({ isVisible, onClose }) => {
	const { colorScheme } = useColorScheme();
	const dispatch = useDispatch<AppDispatch>();
	const { textColor, borderColor, inputBgColor } = useThemeColors();
	const { recipe, status } = useSelector((state: RootState) => state.recipe);
	const { user } = useSelector((state: RootState) => state.user);
	const [selectedRecipe, setSelectedRecipe] = useState<string>("");

	const handleClose = () => {
		onClose();
	};

	const handleSelectedRecipe = (recipeName: string) => {
		setSelectedRecipe(recipeName);
	};

	const handleCreatePost = () => {
		if (!user || !selectedRecipe) {
			return Alert.alert("User or Recipe name is not found!");
		}

		dispatch(
			createPost({
				recipe_name: selectedRecipe,
				user_id: user?.id,
			})
		).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				onClose();
				setSelectedRecipe("");
			}
		});
	};

	return (
		<Modal
			visible={isVisible}
			transparent={true}
			animationType="slide"
			className="bg-black">
			<View className="absolute bottom-0 w-full p-4 border bg-light max-h-3/4 h-max rounded-t-3xl border-light-dark dark:border-dark-light dark:bg-dark">
				{/* header */}
				<View className="flex-row items-center justify-between">
					<StyledText type="heading-4">Create post</StyledText>
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

				<View className="mt-4">
					<View>
						<StyledText className="mb-2">Select recipe to post</StyledText>
						{recipe && recipe.length > 0 ? (
							<SelectList
								data={recipe.map((item, i) => ({
									key: i,
									value: item.name,
									...item,
								}))}
								save="value"
								setSelected={handleSelectedRecipe}
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
						) : (
							<StyledText className="text-red-500">
								Please create a recipe first!
							</StyledText>
						)}
					</View>
					<View className="mt-4 flex-row items-center justify-end">
						<StyledPressable
							disabled={status === "pending"}
							className="bg-main flex items-center"
							onPress={handleCreatePost}>
							{status === "pending" && (
								<Spin size="sm" loading={status === "pending"} />
							)}
							<StyledText>Post</StyledText>
						</StyledPressable>
					</View>
				</View>
			</View>
		</Modal>
	);
};
export default CreatePost;
