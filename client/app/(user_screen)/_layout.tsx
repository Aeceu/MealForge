import React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { useThemeColors } from "@/constants/colors";
const AuthLayout = () => {
	const { colorScheme } = useColorScheme();
	const { tabColor, textColor } = useThemeColors();

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
						headerTintColor: textColor,
						headerShadowVisible: false
					}}
				/>
				<Stack.Screen
					name="UserPreferences"
					options={{
						headerShown: true,
						title: "Personal Preferences",
						headerStyle: {
							backgroundColor: tabColor,
						},
						headerTintColor: textColor,
						headerShadowVisible: false
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
						headerTintColor: textColor,
						headerShadowVisible: false
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
						headerTintColor: textColor,
						headerShadowVisible: false
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
						headerTintColor: textColor,
						headerShadowVisible: false
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
						headerTintColor: textColor,
						headerShadowVisible: false
					}}
				/>
			</Stack>
		</>
	);
};

export default AuthLayout;
