import { useColorScheme } from "nativewind";
import { Image, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import StyledText from "@/components/StyledText";
import ThemeButton from "@/components/ThemeButton";
import StyledPressable from "@/components/StyledPressable";

const index = () => {
	const { colorScheme } = useColorScheme();

	const gradientColor =
		colorScheme === "light" ? ["#BBA78D", "#FFEDD5"] : ["#151210", "#201D1C"];

	const logoImage =
		colorScheme === "dark"
			? require("@/assets/images/logo-light.png")
			: require("@/assets/images/logo-dark.png");

	return (
		<>
			<LinearGradient
				start={{ x: 0.9, y: 0.1 }}
				colors={gradientColor}
				className="absolute top-0 left-0 w-full h-full"
			/>
			<SafeAreaView className="relative w-full h-full">
				{/* <SafeAreaView className="relative w-full h-full bg-light dark:bg-dark"> */}
				<View className="absolute -bottom-[15%] -right-[30%] w-[300] h-[300] rounded-full bg-light-dark dark:bg-dark" />
				{/* <View className="absolute -bottom-[15%] -left-[30%] w-[300] h-[300] rounded-full bg-light-dark dark:bg-dark" /> */}
				{/* <View className="absolute -top-[15%] -right-[30%] w-[300] h-[300] rounded-full bg-light-dark dark:bg-dark-light" /> */}

				{/* Main Container */}
				<View className="items-center justify-between w-full h-full p-8 pt-6">

					<View className="items-end justify-center w-full">
						<ThemeButton />
					</View>

					<View className="flex-1 w-full h-full pt-3">
						<View className="items-center w-full h-1/2">
							<Image source={logoImage} className="absolute w-[80%] max-w-[500px] h-[80%] max-h-[500px] top-[30%]" resizeMode="contain" />
						</View>

						<View className="justify-center flex-1 w-full h-full">
							<StyledText
								type="light"
								fontStyle="default"
								className="text-center"
							>
								Your AI-Powered
							</StyledText>
							<StyledText
								type="light"
								fontStyle="default"
								className="text-center"
							>
								Recipe Crafting Companion.
							</StyledText>
						</View>
					</View>

					<StyledPressable
						size="xl"
						className="bg-main"
						onPress={() => window.alert("😊")}>
						<StyledText
							selectable={false}
							className="text-xl text-[#FFEDD5]"
							fontStyle="Chunk"
							type="bold">
							Get Started
						</StyledText>
					</StyledPressable>
				</View>
			</SafeAreaView>
		</>
	);
};
export default index;
