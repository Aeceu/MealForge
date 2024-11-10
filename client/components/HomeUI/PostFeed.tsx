import { getPosts } from "@/redux/actions/postAction";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import RecipePostCard from "../RecipePostCard";
import StyledText from "../StyledText";
import Spin from "../animations/Spin";

const PostFeed = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { post, status } = useSelector((state: RootState) => state.post);

	useEffect(() => {
		dispatch(getPosts());
	}, []);

	if (status === "pending")
		return (
			<View className="w-full h-full flex-1 flex-col items-center">
				<Spin size={"md"} loading={status === "pending"} />
			</View>
		);

	return (
		<View className="w-full h-full flex-1 flex-col">
			{post.length > 0 ? (
				post.map((item, i) => <RecipePostCard recipe={item} key={i} />)
			) : (
				<StyledText>There is no Post available.</StyledText>
			)}
		</View>
	);
};
export default PostFeed;
