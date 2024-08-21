import { useColorScheme } from "nativewind";
import { Image, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import StyledText from "@/components/StyledText";
import ThemeButton from "@/components/ThemeButton";
import StyledPressable from "@/components/StyledPressable";

const index = () => {
	const { colorScheme } = useColorScheme();

	return (
		<SafeAreaView className="relative w-full h-full bg-dark-shade">
			<View className="items-center justify-between">
				<LinearGradient
					start={{ x: 0.2, y: 0.4 }}
					// colors={["#171310", "#00FFFF"]}
					colors={
						colorScheme === "light"
							? ["#BBA78D", "#ead9bf"]
							: ["#171310", "#201c1b"]
					}
					className="absolute top-0 left-0 h-full w-full"
				/>
				<View className="absolute -bottom-[10%] -right-[25%] w-[300] h-[300] rounded-full bg-light-shade dark:bg-dark-shade" />

				{/* Main Container */}
				<View className="h-full w-full items-center justify-between p-8">
					<View className="flex-row items-center justify-end w-full">
						<ThemeButton />
					</View>
					<View className="gap-4">
						{colorScheme === "dark" ? (
							<Image
								source={require("@/assets/images/logo-sm.png")}
								className=" self-center"
							/>
						) : (
							<Image
								source={require("@/assets/images/dark-logo-sm.png")}
								className=" self-center"
							/>
						)}
						<StyledText
							type="title"
							fontStyle="Makeba"
							className="text-center tracking-widest font-[Makeba]">
							Your AI-Powered Recipe Crafting Companion.
						</StyledText>
					</View>

					<StyledPressable type="xl" onPress={() => window.alert("😊")}>
						<StyledText
							selectable={false}
							className="text-white"
							type="subtitle">
							Get Started
						</StyledText>
					</StyledPressable>
				</View>
			</View>
		</SafeAreaView>
	);
};
export default index;
