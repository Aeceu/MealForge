import React, { useEffect } from "react";
import { Redirect, router, Tabs } from "expo-router";
import { View, Image, Text, ImageProps } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useThemeColors } from "@/constants/colors";
import { icons } from "@/constants";
import { handleRefresh } from "@/redux/actions/userActions";

type TabIconProps = {
	icon: ImageProps;
	color: string;
	name: string;
	focused: boolean;
};

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
	return (
		<View
			className={`flex-col items-center justify-center   ${
				focused && "text-red-500"
			}`}>
			<Image
				source={icon}
				resizeMode="contain"
				tintColor={focused ? "#ef4444" : color}
				className="w-6 h-6"
			/>
			<Text
				className={`${focused ? "font-psemibold" : "font-pregular "} text-xs`}
				style={{ color: focused ? "#ef4444" : color }}>
				{name}
			</Text>
		</View>
	);
};

const AppLayout = () => {
	const { accessToken, user, pageLoading, error } = useSelector(
		(state: RootState) => state.user
	);
	const dispatch = useDispatch<AppDispatch>();
	const { textColor, inActiveColor, tabColor } = useThemeColors();

	useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				dispatch(handleRefresh());
			} catch (axiosError) {
				console.log(axiosError);
				console.log(error);
				router.push("/(auth)/login");
			}
		};
		!user || (!accessToken && verifyRefreshToken);
	}, []);

	if (!user && !accessToken && !pageLoading) {
		console.log("Redirect");
		return <Redirect href={"/(auth)/login"} />;
	}

	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: textColor,
					tabBarInactiveTintColor: inActiveColor,
					tabBarShowLabel: false,
					tabBarStyle: {
						backgroundColor: tabColor,
						borderTopColor: tabColor,
						borderTopWidth: 1,
						height: 84,
					},
				}}>
				<Tabs.Screen
					name="home"
					options={{
						title: "Home",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.home_light}
								color={color}
								name="Home"
								focused={focused}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="drawer"
					options={{
						title: "Drawer",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.drawer_light}
								color={color}
								name="Drawer"
								focused={focused}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="bookmark"
					options={{
						title: "Bookmark",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.bookmark_light}
								color={color}
								name="Bookmark"
								focused={focused}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="user"
					options={{
						title: "User",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.user_light}
								color={color}
								name="User"
								focused={focused}
							/>
						),
					}}
				/>
			</Tabs>
		</>
	);
};

export default AppLayout;
