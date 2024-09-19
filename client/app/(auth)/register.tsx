import { View, SafeAreaView, Image, ScrollView } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "../../constants/constants";
import StyledText from "@/components/StyledText";
import StyledTextInput from "@/components/StyledTextInput";
import StyledPressable from "@/components/StyledPressable";
import { router } from "expo-router";

const Register = () => {
	const { gradientColor, logoImage } = useThemeColors();

	return (
		<>
			<LinearGradient
				start={{ x: 0.9, y: 0.1 }}
				colors={gradientColor}
				className="absolute top-0 left-0 w-full h-full"
			/>
			<SafeAreaView className="relative w-full h-full">
				{/* lower left */}
				<View className="absolute -bottom-[15%] -left-[30%] w-[300] h-[300] rounded-full bg-light-dark dark:bg-dark" />

				{/* scroll container*/}
				<ScrollView>
					<View className="items-center flex-1 w-full max-h-full min-h-screen p-10 pb-4">
						<View className="items-center w-full max-h-[100px]">
							<Image
								source={logoImage}
								className="w-full h-full "
								resizeMode="contain"
							/>
						</View>

						<StyledText
							type="heading-1"
							fontStyle="ChunkP"
							className="pt-3 text-center">
							Create an Account
						</StyledText>

						<StyledText
							type="subheading"
							fontStyle="default"
							className="pt-1 text-center">
							Create an account to use MealForge.
						</StyledText>

						<View className="flex-1">
							<View className="w-full pt-8">
								<StyledTextInput
									className="w-full"
									title="Username"
									// handleTextChange={handleTextChange}
								/>
							</View>

							<View className="w-full pt-4">
								<StyledTextInput
									className="w-full"
									title="Email"
									// handleTextChange={handleTextChange}
								/>
							</View>

							<View className="w-full pt-4">
								<StyledTextInput
									className="w-full"
									title="Password"
									// handleTextChange={handleTextChange}
								/>
							</View>
						</View>

						<View className="flex-row items-end mt-12 space-x-2">
							<StyledText selectable={false} fontStyle="default" type="label">
								Already have an Account?
							</StyledText>

							<StyledPressable
								size="text"
								onPress={() => router.replace("/(auth)/login")}>
								<StyledText
									className=""
									selectable={false}
									fontStyle="default"
									type="link">
									Sign-In
								</StyledText>
							</StyledPressable>
						</View>

						<StyledPressable
							size="xl"
							className="mt-4 bg-main"
							// onPress={() => router.push('/(app)home')}
						>
							<StyledText selectable={false} fontStyle="Chunk" type="button">
								Create Account
							</StyledText>
						</StyledPressable>
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	);
};

export default Register;
