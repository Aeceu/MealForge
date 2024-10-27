import {
	View,
	RefreshControl,
	Image,
	TextInput,
	FlatList,
	ScrollView,
} from "react-native";
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
import { router } from "expo-router";
import StyledText from "@/components/StyledText";
import { useThemeColors } from "@/constants/colors";

const Home = () => {
	const { colorScheme } = useColorScheme();
	const [filter, setFilter] = useState("");
	const [search, setSearch] = useState("");
	const dispatch = useDispatch<AppDispatch>();
	const { placeholderColor } = useThemeColors();
	const { user } = useSelector((state: RootState) => state.user);
	const { accessToken, pageLoading } = useSelector(
		(state: RootState) => state.auth
	);

	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	const handleSelectFilter = (filtername: string) => {
		if (filter === filtername) {
			setFilter("");
		} else {
			setFilter(filtername);
		}
	};

	if (pageLoading) return <Loading />;

	return (
		<FlatList
			className="p-4 pt-0 bg-light dark:bg-dark"
			data={dummyRecipePosts}
			renderItem={({ item }) => <RecipePostCard recipe={item} />}
			keyExtractor={(item) => item.id.toString()}
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}
			ListHeaderComponent={
				<View>
					{/* Header */}
					<View className="flex-row items-center justify-between w-full py-4 mt-6">
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
									user?.profile_picture_url
										? { uri: user.profile_picture_url }
										: images.loading_light
								}
								resizeMode="contain"
								className="w-10 h-10 rounded-full"
							/>
						</StyledPressable>
					</View>

					{/* Search Box */}
					<View className="w-full h-[50px] flex-row items-center justify-between bg-light-dark dark:bg-dark-light rounded-xl pr-3 border border-light-border dark:border-dark-border focus:border-gray dark:focus:border-main">
						<TextInput
							value={search}
							onChangeText={(e) => setSearch(e)}
							placeholder="Search recipes"
							className="flex-1 w-full h-full px-3 text-dark-light dark:text-light-dark"
							placeholderTextColor={placeholderColor}
						/>
						<View
							className={`absolute w-full h-full rounded-xl -z-10
          ${colorScheme === "light" ? "bg-light-dark" : "bg-dark-light"}
        `}></View>
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

					{/* Separator */}
					<View className="w-full h-4 border-b border-dark/10 dark:border-light/10"></View>

					{/* Filter tab */}
					<ScrollView horizontal>
						<View className="flex-1 w-full flex-row items-center justify-between mt-4">
							<StyledText className="mr-2">Filter by:</StyledText>

							<StyledPressable
								onPress={() => handleSelectFilter("Popular")}
								size="sm"
								className={`flex-1 px-3 py-1.5 rounded-full mx-0.5 border border-light-border dark:border-dark-border ${
									filter === "Popular" && "bg-light-dark dark:bg-dark-light"
								}`}>
								<StyledText type="label">Popular</StyledText>
							</StyledPressable>
							<StyledPressable
								onPress={() => handleSelectFilter("Latest")}
								size="sm"
								className={`flex-1 px-3 py-1.5 rounded-full mx-0.5 border border-light-border dark:border-dark-border ${
									filter === "Latest" && "bg-light-dark dark:bg-dark-light"
								}`}>
								<StyledText type="label">Latest</StyledText>
							</StyledPressable>
						</View>
					</ScrollView>
				</View>
			}
			ListFooterComponent={<View style={{ height: 50 }} />}
		/>
	);
};

export default Home;
