import {
	View,
	ScrollView,
	RefreshControl,
	Image,
	Text,
	TextInput,
} from "react-native";
import React, { useState } from "react";
import StyledText from "@/components/StyledText";
import Loading from "@/components/Loading";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleRefresh } from "@/redux/actions/authActions";
import { icons, images } from "@/constants";
import StyledPressable from "@/components/StyledPressable";
import Spin from "@/components/animations/Spin";
import { useColorScheme } from "nativewind";
import { dummyRecipePosts } from "@/constants/dummy_data";
import RecipePostCard from "@/components/RecipePostCard";
import StyledTextInput from "@/components/StyledTextInput";
import { useThemeColors } from "@/constants/colors";
import { router } from "expo-router";

const Home = () => {
	const [search, setSearch] = useState("");
	const { colorScheme } = useColorScheme();
	const { placeholderColor } = useThemeColors();
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
			className="bg-light dark:bg-dark"
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}
		>
			<View className="flex-col w-full h-full p-4">
				{/* Header */}
				<View className="flex-row items-center justify-between w-full py-4 mt-2">
					<Image
						source={
							colorScheme === "dark"
								? images.headerLogoLight
								: images.headerLogoDark
						}
						resizeMode="contain"
						className="w-[150px] h-[30px]"
					/>
					<StyledPressable
						size="icon"
						onPress={() => router.push("/(user_screen)/Settings")}>
						<Image
							source={
								colorScheme === "dark"
									? icons.settingslightDark
									: icons.settingsDarkLight
							}
							resizeMode="contain"
							className="w-6 h-6"
						/>
					</StyledPressable>
				</View>

				{/* Search Box */}
				<View
					className={`w-full px-4 h-[50px] flex-row items-center justify-between bg-white dark:bg-dark-light rounded-lg pr-3 border 
						${colorScheme === "light"
							? "border-light-border focus:border-gray"
							: "border-dark-border focus:border-main"}`}>
					<TextInput
						value={search}
						onChangeText={(e) => setSearch(e)}
						placeholder="Search recipes"
						className="flex-1 w-full h-full text-dark dark:text-main-light"
						placeholderTextColor={placeholderColor}
					/>
					<StyledPressable size="icon">
						<Image
							source={
								colorScheme === "dark"
									? icons.searchLightDark
									: icons.searchDarkLight
							}
							resizeMode="contain"
							className="flex-1 w-6 h-6"
						/>
					</StyledPressable>
				</View>

				{/* Feed tab */}
				{dummyRecipePosts.map((item, i) => (
					<RecipePostCard recipe={item} key={i} />
				))}
			</View>
		</ScrollView>
	);
};

export default Home;
