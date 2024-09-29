import {
	View,
	Text,
	TextInput,
	TextProps,
	TouchableOpacity,
	Image,
} from "react-native";
import React, { useState } from "react";
import StyledText from "./StyledText";
import { useThemeColors } from "@/constants/colors";
import { useColorScheme } from "nativewind";
import { icons } from "@/constants";
import StyledPressable from "./StyledPressable";

type Props = TextProps & {
	title?:
		| "default"
		| "Email"
		| "Password"
		| "Username"
		| "Firstname"
		| "Lastname"
		| string;
	handleTextChange?: ((text: string) => void) | undefined;
	value: string;
	error?: string;
};

const StyledTextInput = ({
	title = "default",
	handleTextChange,
	value,
	error,
}: Props) => {
	const [showPassword, setShowPassword] = useState(false);
	const { placeholderColor } = useThemeColors();
	const { colorScheme } = useColorScheme();

	return (
		<View className="w-full">
			<StyledText type="label" fontStyle="default" className="px-3 mb-2">
				{title}
			</StyledText>

			<View className="flex-row items-center w-full border rounded-lg shadow-sm h-14 border-gray focus:border-main focus:border">
				<TextInput
					className={`flex-1 h-full px-5 text-base ${
						colorScheme === "light" ? "text-dark" : "text-light"
					}`}
					placeholder={title}
					placeholderTextColor={placeholderColor}
					value={value}
					onChangeText={handleTextChange}
					secureTextEntry={
						(title === "Password" ||
							title === "Current Password" ||
							title === "Retype Current Password" ||
							title === "New Password") &&
						!showPassword
					}
					style={{ alignSelf: "center" }}
				/>

				{(title === "Password" ||
					title === "Current Password" ||
					title === "Retype Current Password" ||
					title === "New Password") && (
					<StyledPressable
						size="icon"
						onPress={() => setShowPassword(!showPassword)}>
						<Image
							source={
								colorScheme === "dark"
									? showPassword
										? icons.eyeLightDark
										: icons.eyeOffLightDark
									: showPassword
									? icons.eyeDarkLight
									: icons.eyeOffDarkLight
							}
							className="w-6 h-full mr-5"
							resizeMode="contain"></Image>
					</StyledPressable>
				)}

				<View
					className={`absolute w-full h-full rounded-lg -z-10
          ${colorScheme === "light" ? "bg-light opacity-40" : "bg-dark-light"}
        `}></View>
				{/* <BlurView intensity={100} tint='dark' className="">
          <Text>asds</Text>
        </BlurView> */}
			</View>
			{/* Display error message if present */}
			{error && (
				<StyledText fontStyle="default" className="px-5 text-red-600">
					{error}
				</StyledText>
			)}
		</View>
	);
};

export default StyledTextInput;
