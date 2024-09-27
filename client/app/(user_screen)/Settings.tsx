import Loading from "@/components/Loading";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { icons, images } from "@/constants";
import { handleLogout, handleRefresh } from "@/redux/actions/authActions";
import { AppDispatch, RootState } from "@/redux/store";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import {
	Alert,
	Image,
	ImageProps,
	RefreshControl,
	ScrollView,
	View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Href } from "expo-router";

type GeneralItem = {
	icon: ImageProps;
	title: string;
	href: Href<string | object>;
};

const Settings = () => {
	const { colorScheme } = useColorScheme();
	const { pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);
	const dispatch = useDispatch<AppDispatch>();

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
		{
			icon: colorScheme === "dark" ? icons.lockLightDark : icons.lockDarkLight,
			title: "Change Password",
			href: "/(user_screen)/Theme" as Href,
		},
		{
			icon: colorScheme === "dark" ? icons.moonLightDark : icons.moonDarkLight,
			title: "Theme",
			href: "/(user_screen)/Theme" as Href,
		},
	];

	const logout = () => {
		dispatch(handleLogout(accessToken)).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				Alert.alert(res.payload.message);
				router.push("/(auth)/login");
			} else {
				Alert.alert("Logout failed.");
			}
		});
	};

	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};
	// dispatch(clearToken());

	if (pageLoading) return <Loading />;

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			className=" bg-light dark:bg-dark"
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="w-full h-full flex-col px-4">
				<StyledText type="heading-4" className="font-bold py-3  ">
					General
				</StyledText>

				<View className="w-full h-max rounded-lg flex-col px-6 py-3 bg-light-dark dark:bg-dark-light">
					{General.map((item, key) => (
						<StyledPressable
							onPress={() => router.push(item.href)}
							key={key}
							size="xl"
							className={`flex-row items-center justify-between py-4 ${
								key !== General.length - 1
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
										? icons.chevronRightLightDark
										: icons.chevronRightDarkLight
								}
								resizeMode="cover"
								className="w-7 h-7"
							/>
						</StyledPressable>
					))}
				</View>

				{/* <StyledText type="heading-4" className="font-bold py-3 ">
        Support
      </StyledText> */}

				<StyledPressable
					onPress={logout}
					className="mt-4 w-full h-max rounded-lg flex-row items-center justify-start px-6 py-4 bg-light-dark dark:bg-dark-light">
					<Image
						source={icons.logout}
						resizeMode="contain"
						className="w-7 h-7"
					/>
					<StyledText className="ml-3 text-lg text-rose-500">
						Log Out
					</StyledText>
				</StyledPressable>
			</View>
		</ScrollView>
	);
};
export default Settings;
