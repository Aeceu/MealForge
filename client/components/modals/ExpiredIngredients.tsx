import { Image, Modal, ScrollView, View } from "react-native";
import StyledPressable from "../StyledPressable";
import { icons } from "@/constants";
import Popup from "../animations/Popup";
import { TIngredients } from "@/utils/types/ingredients";
import StyledText from "../StyledText";

type Props = {
	isVisible: boolean;
	onClose: () => void;
	expiredIngredients: TIngredients[];
};

const ExpiredIngredients: React.FC<Props> = ({
	isVisible,
	onClose,
	expiredIngredients,
}) => {
	const handleClose = () => {
		onClose();
	};

	return (
		<Modal visible={isVisible} transparent={true} animationType="fade">
			<View className="w-full h-full flex-col items-center justify-center">
				<Popup animate={isVisible} duration={300}>
					<View className="w-[300px] h-[400px]  bg-light dark:bg-dark border border-dark-border rounded-xl p-4">
						<View className="mb-4 w-full flex-row items-center justify-between ">
							<StyledText type="heading-3" className=" font-chunk">
								Expired Ingredients:
							</StyledText>
							<StyledPressable
								onPress={handleClose}
								size="icon"
								className="w-max">
								<Image
									source={icons.closeLightDark}
									className="w-8 h-8"
									resizeMode="contain"
								/>
							</StyledPressable>
						</View>

						<ScrollView className="mb-4 flex-col max-h-[300px]">
							<StyledText type="heading-3" className="font-chunk text-main">
								Main Ingredients:
							</StyledText>
							{expiredIngredients &&
								expiredIngredients.length > 0 &&
								expiredIngredients.map(
									(item, i) =>
										item.type === "main ingredient" && (
											<View
												key={i}
												className="w-full flex-row items-center justify-between">
												<StyledText className="ml-2">• {item.name}</StyledText>
												<StyledText>
													{item.expirationDate?.toString().split("T")[0]}
												</StyledText>
											</View>
										)
								)}
							<StyledText type="heading-3" className="font-chunk text-main">
								Seasonings:
							</StyledText>
							{expiredIngredients &&
								expiredIngredients.length > 0 &&
								expiredIngredients.map(
									(item, i) =>
										item.type === "seasoning" && (
											<View
												key={i}
												className="w-full flex-row items-center justify-between">
												<StyledText className="ml-2">• {item.name}</StyledText>
												<StyledText>
													{item.expirationDate?.toString().split("T")[0]}
												</StyledText>
											</View>
										)
								)}
						</ScrollView>
					</View>
				</Popup>
			</View>
		</Modal>
	);
};

export default ExpiredIngredients;
