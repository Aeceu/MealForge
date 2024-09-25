import Loading from "@/components/Loading";
import StyledText from "@/components/StyledText";
import ThemeButton from "@/components/ThemeButton";
import { handleRefresh } from "@/redux/actions/authActions";
import { AppDispatch, RootState } from "@/redux/store";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const bookmark = () => {
	const { pageLoading } = useSelector((state: RootState) => state.user);
	const { accessToken } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch<AppDispatch>();

	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	if (pageLoading) return <Loading />;
	return (
		<ScrollView
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="w-full h-screen flex-col items-center justify-center bg-light dark:bg-dark ">
				<ThemeButton />
				<StyledText type="title" fontStyle="Makeba" className="text-red-500">
					Bookmark Page
				</StyledText>
			</View>
		</ScrollView>
	);
};
export default bookmark;
