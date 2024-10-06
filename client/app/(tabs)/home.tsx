import { View, RefreshControl, Image, TextInput, FlatList } from "react-native";
import React, { useState } from "react";
import Loading from "@/components/Loading";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleRefresh } from "@/redux/actions/authActions";
import { icons, images } from "@/constants";
import StyledPressable from "@/components/StyledPressable";
import { useColorScheme } from "nativewind";
import { dummyRecipePosts } from "@/constants/dummy_data";
import RecipePostCard from "@/components/RecipePostCard";
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
		<FlatList
			className="bg-light dark:bg-dark p-4"
			data={dummyRecipePosts}
			renderItem={({ item }) => <RecipePostCard recipe={item} />}
			keyExtractor={(item) => item.id.toString()}
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}
			ListHeaderComponent={
				<View>
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

					{/* Separator */}
					<View className="w-full h-[30px] border-b border-dark/10 dark:border-light/10"></View>
				</View>
			}
			ListFooterComponent={<View style={{ height: 50 }} />}
		/>
	);
};

export default Home;
