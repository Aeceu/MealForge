import { styled, useColorScheme } from "nativewind";
import StyledText from "./StyledText";
import { Image, Pressable, View } from "react-native";

const StyledPressable = styled(Pressable);
const ThemeButton = () => {
	const { colorScheme, toggleColorScheme } = useColorScheme();

	const icon =
		colorScheme === "dark"
			? require("@/assets/icons/moon.png")
			: require("@/assets/icons/sun.png");

	return (
		<StyledPressable onPress={toggleColorScheme} className="">
			<View className="">
				<Image className="w-8 h-8" resizeMode="contain" source={icon}></Image>
			</View>
		</StyledPressable>
	);
};
export default ThemeButton;
