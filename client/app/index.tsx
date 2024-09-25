import { useColorScheme } from "nativewind";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import StyledText from "@/components/StyledText";
import ThemeButton from "@/components/ThemeButton";
import StyledPressable from "@/components/StyledPressable";
import { Redirect, router } from "expo-router";
import { useThemeColors } from "../constants/colors";
import { StatusBar } from "expo-status-bar";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const index = () => {
	const { gradientColor, logoImage } = useThemeColors();
	const { colorScheme } = useColorScheme();
	const { refreshToken, accessToken } = useSelector(
		(state: RootState) => state.auth
	);
	const { user } = useSelector((state: RootState) => state.user);

	if (refreshToken && accessToken) {
		console.log("Redirect");
		return <Redirect href={"/(app)/home"} />;
	}

	return (
		<>
			{colorScheme === "dark" ? (
				<StatusBar style="light"></StatusBar>
			) : (
				<StatusBar style="dark"></StatusBar>
			)}
			<LinearGradient
				start={{ x: 0.9, y: 0.1 }}
				colors={gradientColor}
				className="absolute top-0 left-0 w-full h-full"
			/>
			<SafeAreaView className="relative w-full h-full">
				{/* <SafeAreaView className="relative w-full h-full bg-light dark:bg-dark"> */}

				{/* lower right */}
				<View className="absolute -bottom-[15%] -left-[30%] w-[300] h-[300] rounded-full bg-light-dark dark:bg-dark" />

				{/* Main Container */}
				<View className="items-center justify-between w-full h-full p-8 pt-6 ">
					<View className="items-end justify-center w-full">
						<ThemeButton />
					</View>
					<StyledPressable
						onPress={() => console.log(user, accessToken, refreshToken)}>
						<StyledText>Click me for data</StyledText>
					</StyledPressable>
					<View className="flex-1 w-full h-full">
						<View className="items-center justify-end w-full h-1/2">
							<Image
								source={logoImage}
								className="absolute w-[80%] max-w-[500px] h-[80%] max-h-[500px]"
								resizeMode="contain"
							/>
						</View>

						<View className="justify-center flex-1 w-full h-full pb-10">
							<StyledText
								type="subheading"
								fontStyle="default"
								className="text-center">
								Your AI-Powered
							</StyledText>
							<StyledText
								type="subheading"
								fontStyle="default"
								className="text-center">
								Recipe Crafting Companion.
							</StyledText>
						</View>
					</View>

					<StyledPressable
						size="xl"
						className="bg-main"
						onPress={() => router.push("/(auth)/login")}>
						<StyledText selectable={false} fontStyle="Chunk" type="button">
							Get Started
						</StyledText>
					</StyledPressable>
				</View>
			</SafeAreaView>
		</>
	);
};
export default index;
