import { Alert, Image, Modal, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";
import { useColorScheme } from "nativewind";
import { icons } from "@/constants";
import { SelectList } from "react-native-dropdown-select-list-expo";
import { useThemeColors } from "@/constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useState } from "react";
import { createPost } from "@/redux/actions/postAction";
import Spin from "../animations/Spin";
import * as ImagePicker from "expo-image-picker";

type Props = {
	isVisible: boolean;
	onClose: () => void;
};

const CreatePost: React.FC<Props> = ({ isVisible, onClose }) => {
	const { colorScheme } = useColorScheme();
	const { textColor, borderColor, inputBgColor } = useThemeColors();

	const [selectedRecipe, setSelectedRecipe] = useState<string>("");
	const [selectedPhoto, setSelectedPhoto] = useState<string>("");

	const dispatch = useDispatch<AppDispatch>();
	const { recipe } = useSelector((state: RootState) => state.recipe);
	const { status } = useSelector((state: RootState) => state.post);
	const { user } = useSelector((state: RootState) => state.user);
	const { accessToken } = useSelector((state: RootState) => state.auth);

	const handleClose = () => {
		onClose();
		setSelectedRecipe("");
		setSelectedPhoto("");
	};

	const handleSelectedRecipe = (recipeName: string) => {
		setSelectedRecipe(recipeName);
	};

	const handleCreatePost = async () => {
		if (!user || !selectedRecipe || !accessToken) {
			return Alert.alert("User or Recipe name or accessToken is not found!");
		}

		await dispatch(
			createPost({
				recipe_name: selectedRecipe,
				user_id: user?.id,
				file: selectedPhoto,
				accessToken,
			})
		).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				onClose();
			}
		});
	};

	const handlePhotoUpload = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			Alert.alert(
				"Permission denied",
				"Permission to access photos is required."
			);
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled && result.assets[0].uri) {
			setSelectedPhoto(result.assets[0].uri);
		}
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
					{/* Display selected image if available */}
					{selectedPhoto ? (
						<Image
							source={{ uri: selectedPhoto }}
							style={{ width: 100, height: 100, borderRadius: 10 }}
							className="self-center mb-4"
						/>
					) : null}

					<View>
						<StyledPressable
							onPress={handlePhotoUpload}
							className="bg-main py-2 px-4 rounded-lg">
							<StyledText>Add Photo</StyledText>
						</StyledPressable>
					</View>

					<View className="mt-4">
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
							<StyledText className="text-white">Post</StyledText>
						</StyledPressable>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default CreatePost;
