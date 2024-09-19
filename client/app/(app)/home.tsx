import { View, Text, Alert } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import StyledText from "@/components/StyledText";
import StyledPressable from "@/components/StyledPressable";
import { handleLogout, handleRefresh } from "@/redux/actions/userActions";
import { router } from "expo-router";

const Home = () => {
	const { pageLoading, accessToken, user, status } = useSelector(
		(state: RootState) => state.user
	);
	const dispatch = useDispatch<AppDispatch>();

	const logout = () => {
		dispatch(handleLogout()).then((res) => {
			Alert.alert(res.payload.message);
			router.push("/(auth)/login");
		});
	};

	const refresh = () => {
		dispatch(handleRefresh());
	};

	if (pageLoading) {
		return (
			<View className="w-full h-full flex-col items-center justify-center">
				<StyledText type="title" fontStyle="Makeba" className="text-red-500">
					LOADING....
				</StyledText>
			</View>
		);
	}

	return (
		<View className="w-full h-full flex-col items-center justify-center">
			<StyledText type="title" fontStyle="Makeba" className="text-red-500">
				HOME
			</StyledText>
			<StyledPressable size="xl" className="mt-4 bg-main" onPress={logout}>
				<StyledText selectable={false} fontStyle="Chunk" type="button">
					{status === "pending" ? "Logging out..." : "Log out"}
				</StyledText>
			</StyledPressable>
			<StyledPressable size="xl" className="mt-4 bg-main" onPress={refresh}>
				<StyledText selectable={false} fontStyle="Chunk" type="button">
					{status === "pending" ? "Refreshing..." : "Refresh"}
				</StyledText>
			</StyledPressable>
			<View className="flex-col gap-2 p-2">
				<StyledText type="label" className="text-black">
					ID : {user?.id}
				</StyledText>
				<StyledText type="label" className="text-black">
					USERNAME : {user?.userName}
				</StyledText>
				<StyledText type="label" className="text-black">
					EMAIL : {user?.email}
				</StyledText>
				<StyledText type="label" className="text-black">
					ACCESSTOKEN : {accessToken}
				</StyledText>
			</View>
		</View>
	);
};

export default Home;
