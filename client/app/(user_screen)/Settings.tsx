import Loading from "@/components/Loading";
import General from "@/components/SettingsUI/General";
import Preference from "@/components/SettingsUI/Preference";
import SecurityPrivacy from "@/components/SettingsUI/SecurityPrivacy";
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

const Settings = () => {
	const { colorScheme } = useColorScheme();
	const { pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);
	const dispatch = useDispatch<AppDispatch>();

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

	if (pageLoading) return <Loading />;

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			className="w-full h-screen bg-light dark:bg-dark"
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="w-full h-full flex-col px-4 pb-4">
				<StyledText type="heading-4" className="font-bold py-3  ">
					General
				</StyledText>

				<General />

				<StyledText type="heading-4" className="font-bold py-3  ">
					UI Preferences
				</StyledText>

				<Preference />

				<StyledText type="heading-4" className="font-bold py-3  ">
					Privacy & Security
				</StyledText>

				<SecurityPrivacy />

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
