import { View, ScrollView, RefreshControl } from "react-native";
import React from "react";
import StyledText from "@/components/StyledText";
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
			contentContainerStyle={{ flexGrow: 1 }}
			className=" bg-light dark:bg-dark"
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="w-full h-full flex-col p-4">
				<StyledText type="heading-3" className="w-full text-center mt-8 p-6">
					My Home
				</StyledText>
			</View>
		</ScrollView>
	);
};

export default Home;
