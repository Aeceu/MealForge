import Header from "@/components/DrawerUI/Header";
import Ingredients from "@/components/DrawerUI/Ingredients";
import Seasonings from "@/components/DrawerUI/Seasonings";
import Loading from "@/components/Loading";
import AddIngredients from "@/components/modals/AddIngredients";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { icons } from "@/constants";
import { handleRefresh } from "@/redux/actions/authActions";
import { getIngredients } from "@/redux/actions/ingredientsAction";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const drawer = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [selectedTab, setSelectedTab] = useState<
		"main ingredient" | "seasoning"
	>("main ingredient");
	const { user } = useSelector((state: RootState) => state.user);
	const { pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);
	const [showTestModal, setShowTestModal] = useState<boolean>(false);

	const onClose = () => {
		setShowTestModal(false);
	};
	const onRefresh = async () => {
		dispatch(handleRefresh(accessToken)).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				if (!user?.id) {
					return;
				}
				dispatch(getIngredients(user.id));
			}
		});
	};

	useEffect(() => {
		if (!user?.id) return console.log("no userid");
		dispatch(getIngredients(user.id));
	}, []);

	if (pageLoading) return <Loading />;

	return (
		<ScrollView
			contentContainerStyle={{ flex: 1 }}
			className="w-full h-full bg-light dark:bg-dark"
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="flex-col items-center w-full h-full">
				<Header />

				{/* Tabs */}
				<View className="flex-row mt-1">
					<StyledPressable
						onPress={() => setSelectedTab("main ingredient")}
						className={`basis-1/2 ${
							selectedTab === "main ingredient" &&
							"border-b border-dark dark:border-main-50 "
						}`}>
						<StyledText>My Ingredients</StyledText>
					</StyledPressable>
					<StyledPressable
						onPress={() => setSelectedTab("seasoning")}
						className={`basis-1/2 ${
							selectedTab === "seasoning" &&
							"border-b border-dark dark:border-main-50 "
						}`}>
						<StyledText>My Seasonings</StyledText>
					</StyledPressable>
				</View>

				{selectedTab === "main ingredient" && <Ingredients />}
				{selectedTab === "seasoning" && <Seasonings />}

				{/* ADD button */}
				<StyledPressable
					size="icon"
					className="absolute bottom-5 right-5 rounded-full bg-main"
					onPress={() => setShowTestModal(true)}>
					<Image
						source={icons.plus}
						resizeMode="contain"
						className="w-12 h-12 rounded-full"
					/>
				</StyledPressable>

				<AddIngredients
					type={selectedTab}
					isVisible={showTestModal}
					onClose={onClose}
				/>
			</View>
		</ScrollView>
	);
};
export default drawer;
