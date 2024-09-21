import { View } from "react-native";
import React from "react";
import StyledText from "@/components/StyledText";
import ThemeButton from "@/components/ThemeButton";

const Home = () => {
	return (
		<View className="w-full h-full flex-col items-center justify-center">
			<ThemeButton />
			<StyledText type="title" fontStyle="Makeba" className="text-red-500">
				HOME
			</StyledText>
		</View>
	);
};

export default Home;
