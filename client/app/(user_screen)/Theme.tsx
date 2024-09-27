import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { icons } from "@/constants";
import { useColorScheme } from "nativewind";
import { Image, ScrollView, Text, View } from "react-native";

const Theme = () => {
	const { colorScheme, toggleColorScheme } = useColorScheme();
	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			className="w-full h-full bg-light dark:bg-dark flex-col p-4">
			<StyledText
				type="heading-4"
				className="font-bold py-3 mb-4 border-b border-dark/30 dark:border-light/30">
				Select your prefered theme
			</StyledText>

			<StyledPressable
				onPress={toggleColorScheme}
				size="xl"
				className={`flex-row items-center justify-between py-6 px-6   ${
					colorScheme === "dark" && "bg-dark-light"
				}`}>
				<View className="flex-row items-center">
					<Image
						source={
							colorScheme === "dark" ? icons.moonLightDark : icons.moonDarkLight
						}
						resizeMode="contain"
						className="w-6 h-6"
					/>
					<StyledText className="ml-3 text-base">Dark Mode</StyledText>
				</View>
				<Image resizeMode="cover" className="w-7 h-7" />
			</StyledPressable>

			<StyledPressable
				onPress={toggleColorScheme}
				size="xl"
				className={`flex-row items-center justify-between py-6 px-6 ${
					colorScheme === "light" && "bg-light-dark"
				} `}>
				<View className="flex-row items-center">
					<Image
						source={
							colorScheme === "light" ? icons.sunDarkLight : icons.sunLightDark
						}
						resizeMode="contain"
						className="w-6 h-6"
					/>
					<StyledText className="ml-3 text-base">Light Mode</StyledText>
				</View>
				<Image resizeMode="cover" className="w-7 h-7" />
			</StyledPressable>
		</ScrollView>
	);
};
export default Theme;
