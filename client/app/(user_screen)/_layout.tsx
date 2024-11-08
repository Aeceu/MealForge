import React, { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useThemeColors } from "@/constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleRefresh } from "@/redux/actions/authActions";
const AuthLayout = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { tabColor, textColor } = useThemeColors();
	const { user } = useSelector((state: RootState) => state.user);
	const { accessToken, refreshToken, pageLoading } = useSelector(
		(state: RootState) => state.auth
	);

	if (!accessToken && !refreshToken && !pageLoading) {
		return <Redirect href={"/(auth)/login"} />;
	}

	// useEffect(() => {
	// 	if (!user) {
	// 		dispatch(handleRefresh(accessToken));
	// 	}
	// }, [user]);

	return (
		<>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name="EditInformation"
					options={{
						headerShown: true,
						title: "Edit Information",
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
				<Stack.Screen
					name="UserPreferences"
					options={{
						headerShown: true,
						title: "User Preferences",
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
				<Stack.Screen
					name="Theme"
					options={{
						headerShown: true,
						title: "Theme",
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
				<Stack.Screen
					name="Settings"
					options={{
						headerShown: true,
						title: "Settings",
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
				<Stack.Screen
					name="ChangePassword"
					options={{
						headerShown: true,
						title: "Change Password",
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
				<Stack.Screen
					name="DeleteAccount"
					options={{
						headerShown: true,
						title: "Account Deletion",
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
				<Stack.Screen
					name="GenerateRecipe"
					options={{
						headerShown: true,
						title: "Generate Recipe",
						headerStyle: {
							backgroundColor: tabColor,
						},
						headerTintColor: textColor,
						headerShadowVisible: false,
					}}
				/>
			</Stack>
		</>
	);
};

export default AuthLayout;
