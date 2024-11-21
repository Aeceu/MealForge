import { RootState } from "@/redux/store";
import { View } from "react-native";
import { useSelector } from "react-redux";
import RecipePostCard from "../RecipePostCard";
import StyledText from "../StyledText";
import Spin from "../animations/Spin";

const PostFeed = () => {
	const { post, status } = useSelector((state: RootState) => state.post);

	if (status === "pending")
		return (
			<View className="flex-col items-center flex-1 w-full h-full mt-4">
				<Spin size={"md"} loading={status === "pending"} />
			</View>
		);

	return (
		<View className="flex-col flex-1 w-full h-full">
			{post.length > 0 ? (
				post.map((item, i) => <RecipePostCard recipe={item} key={i} />)
			) : (
				<StyledText>There is no Post available.</StyledText>
			)}
		</View>
	);
};
export default PostFeed;
