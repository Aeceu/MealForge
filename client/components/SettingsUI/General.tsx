import { icons } from "@/constants";
import { Href, router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, ImageProps, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";

type GeneralItem = {
	icon: ImageProps;
	title: string;
	href: Href<string | object>;
};

const General = () => {
	const { colorScheme } = useColorScheme();

	const General: GeneralItem[] = [
		{
			icon: colorScheme === "dark" ? icons.editLightDark : icons.editDarkLight,
			title: "Edit Information",
			href: "/(user_screen)/EditInformation" as Href,
		},
		{
			icon: colorScheme === "dark" ? icons.userLightDark : icons.userDarkLight,
			title: "User Preferences",
			href: "/(user_screen)/UserPreferences" as Href,
		},
	];

	return (
		<View className="flex-col w-full px-6 bg-white rounded-lg h-max dark:bg-dark-light">
			{General.map((item, key) => (
				<StyledPressable
					onPress={() => router.push(item.href)}
					key={key}
					size="xl"
					className={`flex-row items-center rounded-none justify-between py-4 ${key !== General.length - 1
						? "border-b border-light-border dark:border-dark-border"
						: ""
						}`}>
					<View className="flex-row items-center">
						<Image
							source={item.icon}
							resizeMode="contain"
							className="w-6 h-6"
						/>
						<StyledText className="ml-3 text-base">{item.title}</StyledText>
					</View>
					<Image
						source={
							colorScheme === "dark"
								? icons.chevronRightLightDark
								: icons.chevronRightDarkLight
						}
						resizeMode="cover"
						className="w-7 h-7"
					/>
				</StyledPressable>
			))}
		</View>
	);
};
export default General;
