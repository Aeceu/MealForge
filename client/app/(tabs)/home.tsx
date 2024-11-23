import { View, RefreshControl, Image, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleRefresh } from "@/redux/actions/authActions";
import { icons, images } from "@/constants";
import StyledPressable from "@/components/StyledPressable";
import { useColorScheme } from "nativewind";
import StyledText from "@/components/StyledText";
import CreatePost from "@/components/modals/CreatePost";
import PostFeed from "@/components/HomeUI/PostFeed";
import { getFilteredPosts, getPosts } from "@/redux/actions/postAction";
import SearchRecipe from "@/components/modals/SearchRecipe";
import DarkBgOverlay from "@/components/DarkBgOverlay";

const Home = () => {
	const [filter, setFilter] = useState("");

	const [darkbg, setDarkBg] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const dispatch = useDispatch<AppDispatch>();
	const { user } = useSelector((state: RootState) => state.user);
	const { post } = useSelector((state: RootState) => state.post);
	const { accessToken, pageLoading } = useSelector(
		(state: RootState) => state.auth
	);

	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	const handleFilter = (newFilter: string) => {
		if (!user) return;
		if (filter === newFilter) {
			setFilter("");
			dispatch(getPosts(user?.id));
		} else {
			setFilter(newFilter);
			dispatch(
				getFilteredPosts({
					userId: user.id,
					filter: newFilter,
				})
			);
		}
	};

	const onOpenModal = () => {
		setShowModal(true);
		setDarkBg(true);
	};

	const onClose = () => {
		setShowModal(false);
		setDarkBg(false);
	};

	useEffect(() => {
		if (user && (pageLoading || post.length <= 0)) {
			dispatch(getPosts(user.id));
		}
	}, [user?.id, pageLoading]);

	if (pageLoading) return <Loading />;

	return (
		<>
			<ScrollView
				className="w-full bg-light dark:bg-dark "
				refreshControl={
					<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
				}>
				<View className="p-4">
					{/* Navbar */}
					<HomeNav />

					{/* Header */}
					<View className="flex-row items-center justify-between px-2">
						<View className="flex-col flex-1">
							<StyledText type="xs">Welcome,</StyledText>
							<StyledText className="flex-1 text-2xl font-chunk">
								{user?.lastName}, {user?.firstName}!
							</StyledText>
						</View>
						<StyledPressable
							onPress={onOpenModal}
							size="icon"
							className="bg-main rounded-xl">
							<Image
								source={icons.plusWhite}
								resizeMode="contain"
								className="w-10 h-10"
							/>
						</StyledPressable>
					</View>

					{/* <StyledText type="xs" className="mx-2 mt-4">
						Filter by:
					</StyledText> */}

					{/* Separator */}
					<View className="flex-1 h-px mx-2 mt-4 rounded-full bg-light-border dark:bg-dark-border" />

					{/* filter */}
					<View className="flex-row items-center  my-1  w-full justify-evenly">
						<StyledPressable
							onPress={() => handleFilter("Ratings")}
							className={`flex-1 px-2 py-1.5 relative rounded-md flex-row items-center w-full justify-between ${
								filter === "Ratings" && "bg-main "
							}`}
							size="icon">
							<StyledText
								type="label"
								className={`text-center w-full ${
									filter === "Ratings" && "text-light"
								}`}>
								Ratings
							</StyledText>
							{filter === "Ratings" && (
								<Image
									source={icons.closeWhite}
									resizeMode="contain"
									className="absolute right-0 w-3 h-3 mr-2"
								/>
							)}
						</StyledPressable>
						<StyledPressable
							onPress={() => handleFilter("Popular")}
							className={`flex-1 px-2 py-1.5 relative rounded-md flex-row items-center w-full justify-between ${
								filter === "Popular" && "bg-main "
							}`}
							size="icon">
							<StyledText
								type="label"
								className={`text-center w-full ${
									filter === "Popular" && "text-white"
								}`}>
								Popular
							</StyledText>
							{filter === "Popular" && (
								<Image
									source={icons.closeWhite}
									resizeMode="contain"
									className="absolute right-0 w-3 h-3 mr-2"
								/>
							)}
						</StyledPressable>
						<StyledPressable
							onPress={() => handleFilter("Latest")}
							className={`flex-1 px-2 py-1.5 relative rounded-md flex-row items-center w-full justify-between ${
								filter === "Latest" && "bg-main "
							}`}
							size="icon">
							<StyledText
								type="label"
								className={`text-center w-full ${
									filter === "Latest" && "text-white"
								}`}>
								Latest
							</StyledText>
							{filter === "Latest" && (
								<Image
									source={icons.closeWhite}
									resizeMode="contain"
									className="absolute right-0 w-3 h-3 mr-2"
								/>
							)}
						</StyledPressable>
					</View>

					{/* Separator */}
					<View className="flex-1 h-px mx-2 rounded-full bg-light-border dark:bg-dark-border" />

					<PostFeed />
				</View>
			</ScrollView>
			{darkbg && <DarkBgOverlay />}
			<CreatePost isVisible={showModal} onClose={onClose} />
		</>
	);
};

export default Home;

const HomeNav = () => {
	const { colorScheme } = useColorScheme();
	const [showSearch, setShowSearch] = useState(false);

	const onClose = () => {
		setShowSearch((prev) => !prev);
	};

	return (
		<>
			<View className="flex-row items-center justify-between w-full my-4">
				<Image
					source={
						colorScheme === "dark"
							? images.headerLogoLight
							: images.headerLogoDark
					}
					resizeMode="contain"
					className="w-[150px] h-[30px]"
				/>

				<StyledPressable
					size="icon"
					onPress={() => setShowSearch((prev) => !prev)}>
					<Image
						source={
							colorScheme === "dark"
								? icons.searchLightDark
								: icons.searchDarkLight
						}
						resizeMode="contain"
						className="w-6 h-6 rounded-full"
					/>
				</StyledPressable>
			</View>

			<SearchRecipe isVisible={showSearch} onClose={onClose} />
		</>
	);
};
