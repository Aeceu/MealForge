import React from "react";
import { Redirect, Stack } from "expo-router";
import { useThemeColors } from "@/constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

const HomeScreenLayout = () => {
	const { tabColor, textColor } = useThemeColors();
	const { accessToken, refreshToken, pageLoading } = useSelector(
		(state: RootState) => state.auth
	);

	if (!accessToken && !refreshToken && !pageLoading) {
		return <Redirect href={"/(auth)/login"} />;
	}

	return (
		<>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name="recipe/[id]"
					options={{
						headerShown: true,
						title: "Recipe Page",
						headerStyle: {
							backgroundColor: tabColor,
						},
						headerTitleStyle: {
							fontFamily: "Poppins-Regular",
							fontSize: 16,
						},
						headerTitleAlign: "center",
						headerTintColor: textColor,
						headerShadowVisible: false,
					}}
				/>
			</Stack>
		</>
	);
};

export default HomeScreenLayout;
