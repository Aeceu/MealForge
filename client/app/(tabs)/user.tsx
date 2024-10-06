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
			}
		>
			<View className="flex-col items-center w-full h-full p-4">
				<View className="flex-row items-start mt-6 mb-4">
					<View className="my-auto border rounded-xl border-light-border dark:border-dark-border">
						<Image
							source={images.loading_light}
							resizeMode="cover"
							className="w-[150px] h-[150px]"
						/>
					</View>

					<View className="flex-1 ml-4">
						<StyledText className="font-chunk" type="heading-3">
							First Name Last Name
						</StyledText>
						<StyledText
							type="label"
							className="text-main">
							@{user?.userName}kuahsdkjasdhkjsh
						</StyledText>

						<View className="flex-row justify-between flex-1 mt-4">
							<StyledPressable
								size="text"
								onPress={() => router.push("/(user_screen)/EditInformation")}
								className="flex-row items-end">
								<Image
									source={
										colorScheme === "dark"
											? icons.editLightDark
											: icons.editDarkLight
									}
									resizeMode="contain"
									className="w-6 h-6 mr-1"
								/>
							</StyledPressable>
							<StyledPressable
								size="text"
								onPress={() => router.push("/(user_screen)/Settings")}
								className="justify-end">
								<Image
									source={
										colorScheme === "light"
											? icons.settingsDarkLight
											: icons.settingslightDark
									}
									resizeMode="contain"
									className="w-6 h-6"
								/>
							</StyledPressable>
						</View>
					</View>
				</View>

				{/* user info */}
				<View className="flex-row items-center flex-1 p-4 bg-white border rounded-xl border-light-border dark:border-dark-border dark:bg-dark-light">
					<View className="flex-col items-center flex-grow basis-1/3">
						<StyledText type="paragraph" className="font-chunk">
							22
						</StyledText>
						<StyledText type="label" fontStyle="light">Ingredients</StyledText>
					</View>

					<View className="flex-col items-center flex-grow basis-1/3">
						<StyledText type="paragraph" className="font-chunk">
							8
						</StyledText>
						<StyledText type="label" fontStyle="light">Recipes</StyledText>
					</View>

					<View className="flex-col items-center flex-grow basis-1/3">
						<StyledText type="paragraph" className="font-chunk">
							1.2 k
						</StyledText>
						<StyledText type="label" fontStyle="light">Likes</StyledText>
					</View>
				</View>

				<View className="flex-row mt-2">
					<StyledPressable className="basis-1/2">
						<StyledText>My Posts</StyledText>
					</StyledPressable>
					<StyledPressable className="basis-1/2">
						<StyledText>My Nigga</StyledText>
					</StyledPressable>
				</View>
			</View>
		</ScrollView >
	);
};
export default user;
