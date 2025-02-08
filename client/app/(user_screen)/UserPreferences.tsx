import Loading from "@/components/Loading";
import AddPreference from "@/components/modals/AddPreference";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { icons } from "@/constants";
import { handleRefresh } from "@/redux/actions/authActions";
import { deleteAllergy } from "@/redux/actions/userActions";
import { RootState, AppDispatch } from "@/redux/store";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Image, RefreshControl, ScrollView, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

const UserPreferences = () => {
	const { pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);
	const { colorScheme } = useColorScheme();
	const { user, status } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch<AppDispatch>();
	const [showAddPrefModal, setShowAddPrefModal] = useState(false);
	const [darkbg, setdarkbg] = useState<boolean>(false);

	const handleAddBtn = () => {
		setShowAddPrefModal(true);
		setdarkbg(true);
	};

	const onClose = () => {
		setShowAddPrefModal(false);
		setdarkbg(false);
	};

	const handleDeletePreference = async (allergy: string) => {
		await dispatch(
			deleteAllergy({
				allergy,
				token: accessToken,
			})
		);
	};

	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};
	if (pageLoading) return <Loading />;
	return (
		<>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				className="w-full h-screen bg-light dark:bg-dark"
				refreshControl={
					<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
				}>
				<View className="flex-col w-full h-full">
					<View className="p-4">
						{/* <StyledText className="text-3xl font-chunk">
						User Preferences
					</StyledText> */}

						<View className="flex-col">
							{user?.allergies ? (
								user?.allergies.split(",").map((item, i) => (
									<View
										key={i}
										className="flex-row items-center justify-between w-full p-4 my-2 bg-white border border-light-border dark:bg-dark-light dark:border-dark-border rounded-xl">
										<View className="flex-col items-start justify-center">
											<StyledText
												key={i}
												className="font-chunk "
												type="heading-2">
												{item}
											</StyledText>
										</View>
										<View className="flex-row items-center justify-center">
											<StyledPressable
												disabled={status === "pending"}
												size="icon"
												onPress={() => handleDeletePreference(item)}>
												<Image
													source={
														colorScheme === "light"
															? icons.closeDarkLight
															: icons.closeLightDark
													}
													resizeMode="contain"
													className="w-7 h-7"
												/>
											</StyledPressable>
										</View>
									</View>
								))
							) : (
								<StyledText className="mt-4 text-center">
									No Preference added yet.
								</StyledText>
							)}
						</View>

						<StyledPressable
							className="w-full mt-4 bg-main"
							onPress={handleAddBtn}>
							<StyledText
								type="subheading"
								className="text-white dark:text-main-50">
								Add Preference
							</StyledText>
						</StyledPressable>
					</View>

					<AddPreference isVisible={showAddPrefModal} onClose={onClose} />
				</View>
			</ScrollView>

			{darkbg && (
				<View className="absolute w-full h-full bg-black/50 z-[9]"></View>
			)}
		</>
	);
};
export default UserPreferences;
