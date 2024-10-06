import Header from "@/components/DrawerUI/Header";
import Ingredients from "@/components/DrawerUI/Ingredients";
import Seasonings from "@/components/DrawerUI/Seasonings";
import Loading from "@/components/Loading";
import AddIngredients from "@/components/modals/AddIngredients";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { icons } from "@/constants";
import { handleRefresh } from "@/redux/actions/authActions";
import { AppDispatch, RootState } from "@/redux/store";
import { useState } from "react";
import { Image, Modal, RefreshControl, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const drawer = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [selectedTab, setSelectedTab] = useState("ingredients");
	const { pageLoading } = useSelector((state: RootState) => state.user);
	const { accessToken } = useSelector((state: RootState) => state.auth);
	const [showTestModal, setShowTestModal] = useState<boolean>(false);

	const onClose = () => {
		setShowTestModal(false);
	};
	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	if (pageLoading) return <Loading />;
	return (
		<ScrollView
			className="w-full h-full bg-light dark:bg-dark"
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="w-full h-screen">
				<Header />

				{/* Tabs */}
				<View className="flex-row mt-1">
					<StyledPressable
						onPress={() => setSelectedTab("ingredients")}
						className={`basis-1/2 ${
							selectedTab === "ingredients" &&
							"border-b dark:border-dark-light "
						}`}>
						<StyledText>My Ingredients</StyledText>
					</StyledPressable>
					<StyledPressable
						onPress={() => setSelectedTab("seasonings")}
						className={`basis-1/2 ${
							selectedTab === "seasonings" && "border-b dark:border-dark-light "
						}`}>
						<StyledText>My Seasonings</StyledText>
					</StyledPressable>
				</View>

				{selectedTab === "ingredients" && <Ingredients />}
				{selectedTab === "seasonings" && <Seasonings />}

				{/* ADD button */}
				<StyledPressable
					size="icon"
					className="absolute bottom-12 right-4 rounded-full bg-main"
					onPress={() => setShowTestModal(true)}>
					<Image
						source={icons.plus}
						resizeMode="contain"
						className="w-12 h-12 rounded-full"
					/>
				</StyledPressable>

				<AddIngredients isVisible={showTestModal} onClose={onClose} />
			</View>
		</ScrollView>
	);
};
export default drawer;
