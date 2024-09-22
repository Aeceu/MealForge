import { View } from "react-native";
import React from "react";
import StyledText from "@/components/StyledText";
import ThemeButton from "@/components/ThemeButton";
import Loading from "@/components/Loading";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Home = () => {
	const { pageLoading } = useSelector((state: RootState) => state.user);

	if (pageLoading) {
		return (
			<View className="w-full h-full flex-col items-center justify-center bg-light dark:bg-dark">
				<Loading />
			</View>
		);
	}
	return (
		<View className="w-full h-full flex-col items-center justify-center bg-light dark:bg-dark">
			<ThemeButton />
			<StyledText type="title" fontStyle="Makeba" className="text-red-500">
				HOME
			</StyledText>
		</View>
	);
};

export default Home;
