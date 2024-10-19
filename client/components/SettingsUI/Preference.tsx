import { icons } from "@/constants";
import { Href, router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, ImageProps, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";

type PreferenceItem = {
	icon: ImageProps;
	title: string;
	href: Href<string | object>;
};

const Preference = () => {
	const { colorScheme } = useColorScheme();

	const Preference: PreferenceItem[] = [
		{
			icon: colorScheme === "dark" ? icons.moonLightDark : icons.moonDarkLight,
			title: "Theme",
			href: "/(user_screen)/Theme" as Href,
		},
	];

	return (
		<View className="flex-col w-full px-6 bg-white rounded-lg h-max dark:bg-dark-light">
			{Preference.map((item, key) => (
				<StyledPressable
					onPress={() => router.push(item.href)}
					key={key}
					size="xl"
					className={`flex-row items-center justify-between py-4 ${key !== Preference.length - 1
						? "border-b border-dark/30 dark:border-light/30"
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
								? icons.chevronRightLight
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
export default Preference;
