import { Image, Modal, View } from "react-native";
import StyledPressable from "../StyledPressable";
import StyledText from "../StyledText";
import { icons } from "@/constants";
import { useState } from "react";

type Props = {
	isVisible: boolean;
	onClose: () => void;
};

const RateRecipe: React.FC<Props> = ({ isVisible, onClose }) => {
	const [rate, setRate] = useState(0);

	const handleClose = () => {
		setRate(0);
		onClose();
	};

	return (
		<Modal visible={isVisible} transparent={true} animationType="fade">
			<View className="w-full h-full flex-col items-center justify-center">
				<View className="w-[300px] h-[250px] bg-light dark:bg-dark border border-dark-border rounded-xl p-4">
					<View className="w-full flex-row items-center justify-end ">
						<StyledPressable
							onPress={handleClose}
							size="icon"
							className="w-max">
							<Image
								source={icons.closeLightDark}
								className="w-7 h-7"
								resizeMode="contain"
							/>
						</StyledPressable>
					</View>

					<View className="py-2 flex-1 flex-col items-center justify-center w-full h-full">
						<StyledText type="heading-4" className="text-center">
							How would you rate this posted recipe ?
						</StyledText>

						<View className=" flex-row items-center mt-6">
							{Array(5)
								.fill(5)
								.map((_, i) => (
									<StyledPressable
										size="icon"
										key={i}
										onPress={() => setRate(i + 1)}>
										<Image
											source={rate <= i ? icons.starLight : icons.starOrange}
											className="w-6 h-6 mx-1"
											resizeMode="contain"
										/>
									</StyledPressable>
								))}
						</View>
					</View>

					<View className="flex-row items-center justify-end w-full">
						<StyledPressable size="sm" className="bg-main">
							<StyledText>Rate</StyledText>
						</StyledPressable>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default RateRecipe;
