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
						// onPress={() => router.push("/(user_screen)/Settings")}
						>
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

					<View className="flex-row items-center justify-between px-2">
						<View className="flex-col flex-1">
							<StyledText type="xs">Welcome,</StyledText>
							<StyledText className="flex-1 text-2xl font-chunk">
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
					<View className="flex-1 h-px mx-2 mt-3 rounded-full bg-light-border dark:bg-dark-border"></View>

					{/* filter */}
					<View className="flex-row items-center flex-1 pl-4 my-1">
						<StyledText type="xs" className="">Filter by:</StyledText>
						<View className="flex-row flex-1 justify-evenly">
							<StyledPressable
								onPress={() => handleFilter("Popular")}
								className={`mx-2 px-2 py-1.5 rounded-md flex-row items-center justify-between ${filter === "Popular" && "bg-main "
									}`}
								size="icon">
								<StyledText type="xs" className={`mr-1 ${filter === "Popular" && "text-white"}`}>Popular</StyledText>
								{filter === "Popular" && (
									<Image
										source={icons.closeWhite}
										resizeMode="contain"
										className="w-3 h-3"
									/>
								)}
							</StyledPressable>
							<StyledPressable
								onPress={() => handleFilter("Latest")}
								className={`mx-2 px-2 py-1.5 rounded-md flex-row items-center justify-between ${filter === "Latest" && "bg-main "
									}`}
								size="icon">
								<StyledText type="xs" className={`mr-1 ${filter === "Latest" && "text-white"}`}>Latest</StyledText>
								{filter === "Latest" && (
									<Image
										source={icons.closeWhite}
										resizeMode="contain"
										className="w-3 h-3"
									/>
								)}
							</StyledPressable>
						</View>
					</View>

					{/* Separator */}
					<View className="flex-1 h-px mx-2 mb-3 rounded-full bg-light-border dark:bg-dark-border"></View>
				</View>
			}
			ListFooterComponent={<View style={{ height: 16 }} />}
		/>
	);
};

export default Home;
