import { getBookmarks, getPosts } from "@/redux/actions/postAction";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { Alert, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import RecipePostCard from "../RecipePostCard";
import StyledText from "../StyledText";
import Spin from "../animations/Spin";
import { setBookmark } from "@/redux/slices/postSlice";

const BookmarkFeed = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { post, pageLoading } = useSelector((state: RootState) => state.post);

	if (pageLoading)
		return (
			<View className="w-full h-full flex-1 flex-col items-center">
				<Spin size={"md"} loading={pageLoading} />
			</View>
		);

	return (
		<View className="w-full h-full flex-1 flex-col">
			{post.length > 0 ? (
				post.map(
					(item, i) =>
						item.is_bookmarked && <RecipePostCard recipe={item} key={i} />
				)
			) : (
				<StyledText>There is no Post available.</StyledText>
			)}
		</View>
	);
};
export default BookmarkFeed;
