import { icons } from "@/constants";
import { Href, router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, ImageProps, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";

type SecurityAndPrivacyItem = {
	icon: ImageProps;
	title: string;
	href: Href<string | object>;
};

const SecurityPrivacy = () => {
	const { colorScheme } = useColorScheme();

	const SecurityAndPrivacy: SecurityAndPrivacyItem[] = [
		{
			icon: colorScheme === "dark" ? icons.lockLightDark : icons.lockDarkLight,
			title: "Change Password",
			href: "/(user_screen)/ChangePassword" as Href,
		},
		{
			icon: icons.userDelete,
			title: "Account Deletion",
			href: "/(user_screen)/DeleteAccount" as Href,
		},
	];

	return (
		<View className="w-full h-max rounded-lg flex-col px-6 py-3 bg-light-dark dark:bg-dark-light">
			{SecurityAndPrivacy.map((item, key) => (
				<StyledPressable
					onPress={() => router.push(item.href)}
					key={key}
					size="xl"
					className={`flex-row items-center justify-between py-4
          ${
						item.href === "/(user_screen)/DeleteAccount"
							? "text-rose-500"
							: "border-b border-dark/30 dark:border-light/30"
					}`}>
					<View className="flex-row items-center">
						<Image
							source={item.icon}
							resizeMode="contain"
							className="w-6 h-6"
						/>
						<StyledText
							className={`ml-3 text-base ${
								item.href === "/(user_screen)/DeleteAccount" && "text-rose-500"
							}`}>
							{item.title}
						</StyledText>
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
export default SecurityPrivacy;
