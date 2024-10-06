import Loading from "@/components/Loading";
import { handleRefresh } from "@/redux/actions/authActions";
import { RootState, AppDispatch } from "@/redux/store";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

const UserPreferences = () => {
	const { pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);
	const dispatch = useDispatch<AppDispatch>();
	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};
	// dispatch(clearToken());

	if (pageLoading) return <Loading />;
	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			className=" bg-light dark:bg-dark"
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}
		>
			<Text>UserPreferences</Text>
		</ScrollView>
	);
};
export default UserPreferences;
