import Loading from "@/components/Loading";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { icons, images } from "@/constants";
import { handleLogout, handleRefresh } from "@/redux/actions/authActions";
import { clearToken } from "@/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Alert, Image, RefreshControl, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const user = () => {
	const { colorScheme } = useColorScheme();
	const { pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);
	const dispatch = useDispatch<AppDispatch>();

	const General = [
		{
			icon: colorScheme === "dark" ? icons.userLightDark : icons.userDarkLight,
			title: "Personal Information",
		},
		{
			icon: colorScheme === "dark" ? icons.userLightDark : icons.userDarkLight,
			title: "User Preferences",
		},
		{
			icon: colorScheme === "dark" ? icons.lockLightDark : icons.lockDarkLight,
			title: "Change Password",
		},
		{
			icon: colorScheme === "dark" ? icons.moonLightDark : icons.moonDarkLight,
			title: "Theme",
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
			<View className="w-full h-full flex-col p-4">
				<StyledText type="heading-3" className="w-full text-center mt-8 p-6">
					My Account
				</StyledText>

				<View className="relative w-full h-[100px] rounded-md  flex-row items-center p-6 bg-light-dark dark:bg-dark-light">
					<StyledPressable className="absolute right-4" size="icon">
						<Image
							source={
								colorScheme === "dark"
									? icons.editLightDark
									: icons.editDarkLight
							}
							resizeMode="contain"
							className="w-7 h-7  "
						/>
					</StyledPressable>
					<Image
						source={images.loading_light}
						resizeMode="contain"
						className="w-16 h-16"
					/>
					<View className="flex-col justify-center  ml-4">
						<StyledText className="font-bold mb-0.5" type="heading-3">
							Jose Acebuche
						</StyledText>
						<StyledText type="label" className="text-xs">
							joseacebuche2@gmail.com
						</StyledText>
					</View>
				</View>

				<StyledText type="heading-4" className="font-bold py-3 ">
					General
				</StyledText>

				<View className="w-full h-max rounded-lg flex-col px-6 py-3 bg-light-dark dark:bg-dark-light">
					{General.map((item, key) => (
						<View
							key={key}
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
						</View>
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
export default user;
