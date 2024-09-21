import React from "react";
import { Redirect, Stack } from "expo-router";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const AuthLayout = () => {
	const { accessToken, user, pageLoading } = useSelector(
		(state: RootState) => state.user
	);

	if (user && accessToken && !pageLoading) {
		console.log("Redirect");
		return <Redirect href={"/(app)/home"} />;
	}
	return (
		<>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name="login"
					options={{ headerShown: false }}></Stack.Screen>
				<Stack.Screen
					name="register"
					options={{ headerShown: false }}></Stack.Screen>
			</Stack>
		</>
	);
};

export default AuthLayout;
