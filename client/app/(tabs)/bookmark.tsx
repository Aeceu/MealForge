import Loading from "@/components/Loading";
import { handleRefresh } from "@/redux/actions/authActions";
import { AppDispatch, RootState } from "@/redux/store";
import { icons } from "@/constants";
import { Image, RefreshControl, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import StyledText from "@/components/StyledText";
import BookmarkFeed from "@/components/BookmarkUI/BookmarkFeed";

const bookmark = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { pageLoading } = useSelector((state: RootState) => state.user);
	const { accessToken } = useSelector((state: RootState) => state.auth);

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
				<View className="flex-row items-center justify-between px-2 mt-4">
					<View className="flex-row items-center flex-1">
						<Image
							source={icons.bookmarkOrange}
							resizeMode="contain"
							className="w-10 h-10 mr-2"
						/>
						<StyledText className="flex-1 text-2xl font-chunk">
							Post Bookmarks
						</StyledText>
					</View>
				</View>

				{/* Separator */}
				<View className="flex-1 h-px mx-2 mt-3 rounded-full bg-light-border dark:bg-dark-border"></View>

				{/* Separator */}
				<View className="flex-1 h-px mx-2 mb-3 rounded-full bg-light-border dark:bg-dark-border" />
				<BookmarkFeed />
			</View>
		</ScrollView>
	);
};
export default bookmark;
