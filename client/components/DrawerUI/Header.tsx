import { icons, images } from "@/constants";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, StyleSheet, View } from "react-native";
import StyledPressable from "../StyledPressable";
const Header = () => {
	const { colorScheme } = useColorScheme();

	return (
		<View className="mt-6 p-4 w-full flex-row items-center justify-between">
			<Image
				source={
					colorScheme === "dark"
						? images.headerLogoLight
						: images.headerLogoDark
				}
				resizeMode="contain"
				className="w-[150px] h-[30px]"
			/>
			<StyledPressable
				size="icon"
				onPress={() => router.push("/(user_screen)/Settings")}>
				<Image
					source={
						colorScheme === "dark"
							? icons.settingslightDark
							: icons.settingsDarkLight
					}
					resizeMode="contain"
					className="w-6 h-6"
				/>
			</StyledPressable>
		</View>
	);
};
export default Header;
