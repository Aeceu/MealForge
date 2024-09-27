import React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
const AuthLayout = () => {
	const { colorScheme } = useColorScheme();
	return (
		<>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name="EditInformation"
					options={{
						headerShown: true,
						title: "Edit Information",
						headerStyle: {
							backgroundColor: colorScheme === "dark" ? "#151210" : "#FFEDD5",
						},
						headerTintColor: colorScheme === "dark" ? "#FFEDD5" : "#151210",
					}}
				/>
				<Stack.Screen
					name="UserPreferences"
					options={{
						headerShown: true,
						title: "Personal Preferences",
						headerStyle: {
							backgroundColor: colorScheme === "dark" ? "#151210" : "#FFEDD5",
						},
						headerTintColor: colorScheme === "dark" ? "#FFEDD5" : "#151210",
					}}
				/>
				<Stack.Screen
					name="Theme"
					options={{
						headerShown: true,
						title: "Theme",
						headerStyle: {
							backgroundColor: colorScheme === "dark" ? "#151210" : "#FFEDD5",
						},
						headerTintColor: colorScheme === "dark" ? "#FFEDD5" : "#151210",
					}}
				/>
				<Stack.Screen
					name="Settings"
					options={{
						headerShown: true,
						title: "Settings",
						headerStyle: {
							backgroundColor: colorScheme === "dark" ? "#151210" : "#FFEDD5",
						},
						headerTintColor: colorScheme === "dark" ? "#FFEDD5" : "#151210",
					}}
				/>
			</Stack>
		</>
	);
};

export default AuthLayout;
