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
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const drawer = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [selectedTab, setSelectedTab] = useState<
		"main ingredient" | "seasoning"
	>("main ingredient");
	const { user } = useSelector((state: RootState) => state.user);
	const [showTestModal, setShowTestModal] = useState<boolean>(false);
	const [darkbg, setdarkbg] = useState<boolean>(false);
	const { colorScheme } = useColorScheme();

	const { ingredients } = useSelector((state: RootState) => state.ingredients);
	const { pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);

	const onClose = () => {
		setShowTestModal(false);
		setdarkbg(false);
	};

	const handleAddBtn = () => {
		setShowTestModal(true);
		setdarkbg(true);
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
		if (pageLoading || ingredients.length <= 0) {
			dispatch(getIngredients(user.id));
		}
	}, [pageLoading]);

	if (pageLoading) return <Loading />;

	return (
		<>
			<ScrollView
				className="w-full bg-light dark:bg-dark"
				refreshControl={
					<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
				}>
				<View className="flex-col items-center w-full h-full">
					<Header />

					{/* Tabs */}
					<View className="flex-row px-8 space-x-4">
						<StyledPressable
							onPress={() => setSelectedTab("main ingredient")}
							className={`rounded-none ${selectedTab === "main ingredient" ? "border-b  border-main opacity-100" : "opacity-60"}`}>
							<StyledText>My Ingredients</StyledText>
						</StyledPressable>
						<StyledPressable
							onPress={() => setSelectedTab("seasoning")}
							className={`rounded-none ${selectedTab === "seasoning" ? "border-b  border-main opacity-100" : "opacity-60"}`}>
							<StyledText>My Seasonings</StyledText>
						</StyledPressable>
					</View>

					{selectedTab === "main ingredient" && <Ingredients />}
					{selectedTab === "seasoning" && <Seasonings />}

					<AddIngredients
						type={selectedTab}
						isVisible={showTestModal}
						onClose={onClose}
					/>
				</View>
			</ScrollView>
			{darkbg && (
				<View className="absolute w-full h-full bg-black/50 z-[9]"></View>
			)}
			{/* ADD button */}
			<StyledPressable
				size="icon"
				className="absolute rounded-full bottom-5 right-5 bg-main"
				onPress={handleAddBtn}>
				<Image
					source={colorScheme === "light" ? icons.plusWhite : icons.plus}
					resizeMode="contain"
					className="w-12 h-12 rounded-full"
				/>
			</StyledPressable>
		</>
	);
};
export default drawer;
