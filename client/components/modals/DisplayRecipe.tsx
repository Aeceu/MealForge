import { Image, Modal, ScrollView, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";
import { useColorScheme } from "nativewind";
import { icons } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleSaveRecipe } from "@/redux/actions/recipeAction";

type Props = {
	isVisible: boolean;
	onClose: () => void;
	recipe: {
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
	} | null;
};

const DisplayRecipe: React.FC<Props> = ({ isVisible, onClose, recipe }) => {
	const { colorScheme } = useColorScheme();
	const dispatch = useDispatch<AppDispatch>();
	const { user } = useSelector((state: RootState) => state.user);

	const handleClose = () => {
		onClose();
	};

	const handleDelete = () => {
		onClose();
	};

	const handleSave = async () => {
		if (recipe) {
			dispatch(
				handleSaveRecipe({
					userId: user?.id,
					recipe,
				})
			).then((res) => {
				if (res.meta.requestStatus === "fulfilled") {
					onClose();
				}
			});
		}
	};

	return (
		<Modal
			visible={isVisible}
			transparent={true}
			animationType="slide"
			className="bg-black">
			<View className="z-10 flex-1">
				<View className="absolute bottom-0 w-full  border bg-light h-[90%] rounded-t-3xl border-light-dark dark:border-dark-light dark:bg-dark">
					<ScrollView>
						<View className="flex-row items-center justify-between p-4 rounded-t-3xl">
							<StyledText type="subheading">Generated Recipe</StyledText>
							<StyledPressable onPress={handleClose} className="ml-auto " size="text">
								{/* <Image
								source={
									colorScheme === "light"
										? icons.closeDarkLight
										: icons.closeLightDark
								}
								className="w-8 h-8"></Image> */}
								<StyledText type="xs" className="underline">
									Close
								</StyledText>
							</StyledPressable>
						</View>

						<View className="flex-col items-start justify-start">
							{/* Header */}
							<View className="flex-col items-start justify-start w-full px-4 py-2">
								<StyledText
									className="font-chunk"
									type="subheading">
									Recipe Name:
								</StyledText>
								<StyledText type="heading-3" className="px-3 font-chunk">
									{recipe?.name}
								</StyledText>
							</View>

							{/* Infos */}
							<View className="flex-col w-full p-4">
								<StyledText
									className="font-chunk"
									type="subheading">
									Recipe Information:
								</StyledText>
								<View className="flex-col items-start justify-center w-full ">
									<View className="flex-row items-center px-3 py-1.5 my-1 rounded-full w-max ">
										<StyledText type="paragraph">Serve for: </StyledText>
										<StyledText type="paragraph">
											{recipe?.serve_for} people{" "}
										</StyledText>
									</View>
									<View className="flex-row items-center px-3 py-1.5 my-1 rounded-full w-max ">
										<StyledText type="paragraph">Serve in: </StyledText>
										<StyledText type="paragraph">
											{recipe?.serve_hot_or_cold}{" "}
										</StyledText>
									</View>
									<View className="flex-row items-center px-3 py-1.5 my-1 rounded-full w-max ">
										<StyledText type="paragraph">Cooking time: </StyledText>
										<StyledText type="paragraph">
											{recipe?.cooking_time} minutes{" "}
										</StyledText>
									</View>
									<View className="flex-row items-center px-3 py-1.5 my-1 rounded-full w-max ">
										<StyledText type="paragraph">Cuisine type: </StyledText>
										<StyledText type="paragraph">
											{recipe?.type_of_cuisine}{" "}
										</StyledText>
									</View>
								</View>
							</View>

							{/* Ingredients */}
							<View className="flex-col w-full p-4">
								<StyledText
									className="font-chunk"
									type="subheading">
									Ingredients:
								</StyledText>
								<View className="flex-col w-full px-3">
									{recipe?.ingredients.map((item, i) => (
										<StyledText
											key={i}
											type="paragraph"
											className="py-2 tracking-wide">
											• {item.name}
										</StyledText>
									))}
								</View>
							</View>

							{/* Instructions */}
							<View className="flex-col w-full p-4">
								<StyledText
									className="font-chunk"
									type="subheading">
									Instructions:
								</StyledText>
								<View className="flex-col w-full px-3">
									{recipe?.instructions.map((item, i) => (
										<StyledText
											key={i}
											type="paragraph"
											className="py-4 tracking-wide">
											{item}
										</StyledText>
									))}
								</View>
							</View>

							<View className="flex-row items-center justify-end w-full p-4">
								<StyledPressable
									onPress={handleSave}
									className="mx-1 rounded-md bg-main"
									size="sm">
									<StyledText className="text-white">Save</StyledText>
								</StyledPressable>
								<StyledPressable
									onPress={handleDelete}
									className="mx-1 bg-red-500 rounded-md"
									size="sm">
									<StyledText className="text-white">Delete</StyledText>
								</StyledPressable>
							</View>
						</View>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
};
export default DisplayRecipe;
