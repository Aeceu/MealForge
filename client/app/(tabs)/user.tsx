import Loading from "@/components/Loading";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { icons, images } from "@/constants";
import { handleRefresh } from "@/redux/actions/authActions";
import { RootState, AppDispatch } from "@/redux/store";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, RefreshControl, ScrollView, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

const user = () => {
	const { user } = useSelector((state: RootState) => state.user);
	const { colorScheme } = useColorScheme();
	const { pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);
	const dispatch = useDispatch<AppDispatch>();
	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	if (pageLoading) return <Loading />;
	return (
		<ScrollView
			className="w-full h-full bg-light dark:bg-dark"
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="w-full h-full flex-col items-center  p-4">
				<StyledText
					type="title"
					fontStyle="Makeba"
					className="w-full text-left mt-6 py-6">
					My Profile
				</StyledText>
				<View className="w-full rounded-md flex-row items-center py-3 px-6 bg-light-dark dark:bg-dark-light">
					<View className="flex-col items-center">
						<Image
							source={images.loading_light}
							resizeMode="contain"
							className="w-[60px] h-[60px]"
						/>
						<StyledText className="font-bold mt-1" type="label">
							@{user?.userName}
						</StyledText>
					</View>

					<View className="flex-1 flex-row items-center justify-between ml-4">
						<View className="flex-col items-center">
							<StyledText type="label" className="font-bold">
								22
							</StyledText>
							<StyledText type="label">Ingredients</StyledText>
						</View>
						<View className="flex-col items-center">
							<StyledText type="label" className="font-bold">
								8
							</StyledText>
							<StyledText type="label">Recipes</StyledText>
						</View>
						<View className="flex-col items-center">
							<StyledText type="label" className="font-bold">
								1.2 k
							</StyledText>
							<StyledText type="label">Likes</StyledText>
						</View>
					</View>
				</View>

				<View className="p-2 flex-row items-center justify-center w-full">
					<StyledPressable
						onPress={() => router.push("/(user_screen)/EditInformation")}
						className="mr-2 rounded-md flex-row items-center justify-center bg-light-dark dark:bg-dark-light">
						<Image
							source={
								colorScheme === "dark"
									? icons.editLightDark
									: icons.editDarkLight
							}
							resizeMode="contain"
							className="mr-2 w-6 h-6"
						/>
						<StyledText>Edit Profile</StyledText>
					</StyledPressable>
					<StyledPressable
						onPress={() => router.push("/(user_screen)/Settings")}
						className="ml-2 rounded-md flex-row items-center justify-center bg-light-dark dark:bg-dark-light">
						<Image
							source={
								colorScheme === "light"
									? icons.settingsDarkLight
									: icons.settingslightDark
							}
							resizeMode="contain"
							className="mr-2 w-6 h-6"
						/>
						<StyledText>Settings</StyledText>
					</StyledPressable>
				</View>
			</View>
		</ScrollView>
	);
};
export default user;
