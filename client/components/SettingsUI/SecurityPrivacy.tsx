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
		<View className="flex-col w-full px-6 bg-white rounded-lg h-max dark:bg-dark-light">
			{SecurityAndPrivacy.map((item, key) => (
				<StyledPressable
					onPress={() => router.push(item.href)}
					key={key}
					size="xl"
					className={`flex-row items-center rounded-none justify-between py-4
          ${item.href === "/(user_screen)/DeleteAccount"
							? "text-rose-500"
							: "border-b border-light-border dark:border-dark-border"
						}`}>
					<View className="flex-row items-center">
						<Image
							source={item.icon}
							resizeMode="contain"
							className="w-6 h-6"
						/>
						<StyledText
							className={`ml-3 text-base ${item.href === "/(user_screen)/DeleteAccount" && "text-rose-500"
								}`}>
							{item.title}
						</StyledText>
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
export default SecurityPrivacy;
