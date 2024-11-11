import Loading from "@/components/Loading";
import StyledPressable from "@/components/StyledPressable";
import { useThemeColors } from "@/constants/colors";
import { handleRefresh } from "@/redux/actions/authActions";
import { AppDispatch, RootState } from "@/redux/store";
import { icons, images } from "@/constants";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
	FlatList,
	Image,
	RefreshControl,
	ScrollView,
	TextInput,
	View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { dummyRecipePosts } from "@/constants/dummy_data";
import BookmarkedRecipeCard from "@/components/BookmarkedRecipeCard";
import StyledText from "@/components/StyledText";
import BookmarkFeed from "@/components/BookmarkUI/BookmarkFeed";

const bookmark = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { pageLoading, user } = useSelector((state: RootState) => state.user);
	const { accessToken } = useSelector((state: RootState) => state.auth);

	const [filter, setFilter] = useState("");

	const handleFilter = (newFilter: string) => {
		if (filter === newFilter) {
			setFilter("");
		} else {
			setFilter(newFilter);
		}
	};

	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	if (pageLoading) return <Loading />;
	return (
		<ScrollView
			className="w-full bg-light dark:bg-dark "
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="p-4 ">
				{/* Header */}
				<View className="flex-row items-center justify-between px-2 mt-8">
					<View className="flex-col flex-1">
						<StyledText className="flex-1 text-2xl font-chunk">
							Post Bookmarks
						</StyledText>
					</View>
				</View>

				{/* Separator */}
				<View className="flex-1 h-px mx-2 mt-3 rounded-full bg-light-border dark:bg-dark-border"></View>

				{/* filter */}
				<View className="flex-row items-center flex-1 pl-4 my-1">
					<StyledText type="xs" className="">
						Filter by:
					</StyledText>
					<View className="flex-row flex-1 justify-evenly">
						<StyledPressable
							onPress={() => handleFilter("Popular")}
							className={`mx-2 px-2 py-1.5 rounded-md flex-row items-center justify-between ${
								filter === "Popular" && "bg-main "
							}`}
							size="icon">
							<StyledText
								type="xs"
								className={`mr-1 ${filter === "Popular" && "text-white"}`}>
								Popular
							</StyledText>
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
							className={`mx-2 px-2 py-1.5 rounded-md flex-row items-center justify-between ${
								filter === "Latest" && "bg-main "
							}`}
							size="icon">
							<StyledText
								type="xs"
								className={`mr-1 ${filter === "Latest" && "text-white"}`}>
								Latest
							</StyledText>
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
				<View className="flex-1 h-px mx-2 mb-3 rounded-full bg-light-border dark:bg-dark-border" />
				<BookmarkFeed />
			</View>
		</ScrollView>
	);
};
export default bookmark;
