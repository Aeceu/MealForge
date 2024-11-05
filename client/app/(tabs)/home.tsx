import { View, RefreshControl, Image, FlatList } from "react-native";
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

const Home = () => {
	const { colorScheme } = useColorScheme();
	const [filter, setFilter] = useState("");
	const dispatch = useDispatch<AppDispatch>();
	const { user } = useSelector((state: RootState) => state.user);
	const { accessToken, pageLoading } = useSelector(
		(state: RootState) => state.auth
	);

	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	const handleFilter = (newFilter: string) => {
		if (filter === newFilter) {
			setFilter("");
		} else {
			setFilter(newFilter);
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
					<View className="flex-row items-center justify-between w-full py-4 mt-8">
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
										? icons.searchLightDark
										: icons.searchDarkLight
								}
								resizeMode="contain"
								className="w-6 h-6 rounded-full"
							/>
						</StyledPressable>
					</View>

					<View className="flex-row items-center justify-between">
						<View className="flex-col">
							<StyledText type="heading-5">Welcome,</StyledText>
							<StyledText className="font-chunk text-3xl">
								{user?.lastName}, {user?.firstName}!
							</StyledText>
						</View>
						<StyledPressable size="icon" className="bg-main rounded-xl">
							<Image
								source={icons.plusWhite}
								resizeMode="contain"
								className="w-10 h-10"
							/>
						</StyledPressable>
					</View>

					{/* Separator */}
					<View className="w-full h-4  border-b border-dark/10 dark:border-light/10"></View>

					<View className="flex-row items-center mt-4">
						<StyledText type="label">Filter by:</StyledText>
						<StyledPressable
							onPress={() => handleFilter("Popular")}
							className={`mx-2 px-3 py-1.5 rounded-md flex-row items-center justify-between ${
								filter === "Popular" && "bg-main "
							}`}
							size="icon">
							<StyledText type="label">Popular</StyledText>
							{filter === "Popular" && (
								<Image
									source={icons.closeLightDark}
									resizeMode="contain"
									className="w-4 h-4"
								/>
							)}
						</StyledPressable>
						<StyledPressable
							onPress={() => handleFilter("Latest")}
							className={`mx-2 px-3 py-1.5 rounded-md flex-row items-center justify-between ${
								filter === "Latest" && "bg-main "
							}`}
							size="icon">
							<StyledText type="label">Latest</StyledText>
							{filter === "Latest" && (
								<Image
									source={icons.closeLightDark}
									resizeMode="contain"
									className="w-4 h-4"
								/>
							)}
						</StyledPressable>
					</View>
				</View>
			}
			ListFooterComponent={<View style={{ height: 50 }} />}
		/>
	);
};

export default Home;
