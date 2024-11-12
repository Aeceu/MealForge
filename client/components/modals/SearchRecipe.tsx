import { useThemeColors } from "@/constants/colors";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import StyledPressable from "../StyledPressable";
import { Image } from "react-native";
import { icons } from "@/constants";
import StyledText from "../StyledText";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { searchPostRecipe } from "@/redux/actions/postAction";
import Spin from "../animations/Spin";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
	isVisible: boolean;
	onClose: () => void;
};

type TSearchPostRecipe = {
	id: string;
	recipe_name: string;
	recipe_ingredients: string;
	recipe_post_image: string | null;
};

const SearchRecipe: React.FC<Props> = ({ isVisible, onClose }) => {
	const { colorScheme } = useColorScheme();
	const { placeholderColor, NewGradientColor } = useThemeColors();

	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [postRecipe, setPostRecipe] = useState<TSearchPostRecipe[]>([]);

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		let debounceTimeout: NodeJS.Timeout;

		if (search) {
			setLoading(true);

			debounceTimeout = setTimeout(() => {
				dispatch(searchPostRecipe(search)).then((res) => {
					if (res.meta.requestStatus === "fulfilled") {
						setPostRecipe(res.payload);
					} else {
						setPostRecipe([]);
					}
					setLoading(false);
				});
			}, 500);
		} else {
			setPostRecipe([]);
			setLoading(false);
		}

		return () => {
			if (debounceTimeout) clearTimeout(debounceTimeout);
		};
	}, [search, dispatch]);

	const handleClose = () => {
		onClose();
		setSearch("");
		setPostRecipe([]);
	};

	const handleClick = (postId: string) => {
		onClose();
		setSearch("");
		setPostRecipe([]);
		router.push(`/(home_screen)/post/${postId}`);
	};

	return (
		<Modal
			visible={isVisible}
			transparent={true}
			animationType="slide"
			className="">
			<View className="absolute w-full h-full p-4 bg-light dark:bg-dark border border-light-dark dark:border-dark-light">
				{/* header */}
				<View className="flex-row items-center justify-between">
					<StyledText type="heading-4"></StyledText>
					<StyledPressable onPress={handleClose} size="icon">
						<Image
							source={
								colorScheme === "light"
									? icons.closeDarkLight
									: icons.closeLightDark
							}
							className="w-8 h-8"></Image>
					</StyledPressable>
				</View>

				{/* Search box */}
				<View className="mt-4 h-[50px] flex-row items-center justify-between bg-white dark:bg-dark-light rounded-lg pr-3 border border-light-border dark:border-dark-border focus:border-gray dark:focus:border-main">
					<TextInput
						value={search}
						onChangeText={(e) => setSearch(e)}
						placeholder="Search for recipes..."
						className="flex-1 w-full h-full px-3 text-dark-light dark:text-light-dark"
						placeholderTextColor={placeholderColor}
					/>
					<View
						className={`absolute w-full h-full rounded-lg -z-10
          ${colorScheme === "light" ? "bg-white" : "bg-dark-light"}
        `}></View>
					<StyledPressable size="icon">
						<Image
							source={
								colorScheme === "dark"
									? icons.searchLightDark
									: icons.searchDarkLight
							}
							resizeMode="contain"
							className="flex-1 w-6 h-6"
						/>
					</StyledPressable>
				</View>

				{/* Result */}
				{loading ? (
					<View className="w-full flex items-center justify-center p-4">
						<Spin size="sm" loading={loading} />
					</View>
				) : postRecipe.length > 0 ? (
					<View className="w-full flex-col mt-4">
						{postRecipe.map((item, i) => (
							<View
								key={i}
								className="w-full bg-light dark:bg-dark-light border border-light-border dark:border-dark-border rounded-lg p-4 my-1 relative overflow-hidden">
								{item.recipe_post_image && (
									<View className="w-full h-full absolute top-0 left-0">
										<Image
											source={{ uri: item.recipe_post_image }}
											resizeMode="cover"
											className="absolute w-full  h-[150px]"
											style={{ opacity: colorScheme === "dark" ? 0.2 : 0.4 }}
										/>
										<LinearGradient
											start={{ x: 1, y: 0 }}
											end={{ x: 0, y: 0 }}
											colors={NewGradientColor}
											className="absolute top-0 left-0 w-full  h-[150px]"
										/>
									</View>
								)}
								<StyledPressable
									size="link"
									onPress={() => handleClick(item.id)}>
									<StyledText className="font-chunk text-lg">
										{item.recipe_name}
									</StyledText>
								</StyledPressable>
								<ScrollView
									horizontal
									showsHorizontalScrollIndicator={false}
									className="w-full">
									<View className="mt-2 flex-row items-start justify-center w-full">
										{item.recipe_ingredients.split(",").map((item, i) => (
											<StyledText
												key={i}
												className="px-3 bg-light-dark dark:bg-dark py-1 text-xs mr-0.5 rounded-full w-max ">
												{item}
											</StyledText>
										))}
									</View>
								</ScrollView>
							</View>
						))}
					</View>
				) : (
					<StyledText className="mt-4">No post is search.</StyledText>
				)}
			</View>
		</Modal>
	);
};
export default SearchRecipe;
