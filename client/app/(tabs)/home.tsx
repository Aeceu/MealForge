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
			className=" bg-light dark:bg-dark"
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="w-full h-full flex-col p-4">
				{/* Header */}
				<View className="mt-6 py-4 w-full flex-row items-center justify-between">
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
				<View className="w-full h-[50px] flex-row items-center justify-between bg-light-dark dark:bg-dark-light rounded-lg pr-3 border border-dark/10 dark:border-light/10">
					<TextInput
						value={search}
						onChangeText={(e) => setSearch(e)}
						placeholder="Search recipes"
						className="w-full h-full px-3 flex-1 text-dark-light dark:text-light-dark"
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
							className="w-6 h-6 flex-1"
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
