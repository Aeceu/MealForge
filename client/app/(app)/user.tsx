import Loading from "@/components/Loading";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import ThemeButton from "@/components/ThemeButton";
import { handleLogout, handleRefresh } from "@/redux/actions/authActions";
import { AppDispatch, RootState } from "@/redux/store";
import { router } from "expo-router";
import { Alert, RefreshControl, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const user = () => {
	const { pageLoading, user, status } = useSelector(
		(state: RootState) => state.user
	);
	const { accessToken } = useSelector((state: RootState) => state.auth);
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
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="w-full h-screen flex-col items-center justify-center bg-light dark:bg-dark ">
				<ThemeButton />
				<StyledText type="title" fontStyle="Makeba" className="text-red-500">
					Profile Page
				</StyledText>
				<StyledPressable size="xl" className="mt-4 bg-main" onPress={logout}>
					<StyledText selectable={false} fontStyle="Chunk" type="button">
						{status === "pending" ? "Logging out..." : "Log out"}
					</StyledText>
				</StyledPressable>
				{/* <StyledPressable size="xl" className="mt-4 bg-main" onPress={refresh}>
				<StyledText selectable={false} fontStyle="Chunk" type="button">
					{status === "pending" ? "Refreshing..." : "Refresh"}
				</StyledText>
			</StyledPressable> */}
				<View className="flex-col gap-2 p-2">
					<StyledText type="label">ID : {user?.id}</StyledText>
					<StyledText type="label">USERNAME : {user?.userName}</StyledText>
					<StyledText type="label">EMAIL : {user?.email}</StyledText>
				</View>
			</View>
		</ScrollView>
	);
};
export default user;
