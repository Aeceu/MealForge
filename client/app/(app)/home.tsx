import { View, ScrollView, RefreshControl } from "react-native";
import React from "react";
import StyledText from "@/components/StyledText";
import ThemeButton from "@/components/ThemeButton";
import Loading from "@/components/Loading";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleRefresh } from "@/redux/actions/authActions";

const Home = () => {
	const { accessToken, pageLoading } = useSelector(
		(state: RootState) => state.auth
	);
	const dispatch = useDispatch<AppDispatch>();

	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	if (pageLoading) return <Loading />;

	return (
		<ScrollView
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="w-full h-screen flex-col items-center justify-center bg-light dark:bg-dark">
				<ThemeButton />

				<StyledText type="title" fontStyle="Makeba" className="text-red-500">
					HOME
				</StyledText>
			</View>
		</ScrollView>
	);
};

export default Home;
