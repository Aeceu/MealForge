import StyledText from "@/components/StyledText";
import { images } from "@/constants";
import { useLocalSearchParams } from "expo-router";
import { Image } from "react-native";
import { ScrollView, Text, View } from "react-native";

const RecipePostPage = () => {
	const { id } = useLocalSearchParams();
	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			className="flex-col w-full h-full p-6 bg-light dark:bg-dark">
			<View className="flex-col items-start justify-start">
				{/* Header */}
				<View className="w-full flex-col items-start justify-start">
					<StyledText type="heading-2" className="font-chunk">
						Spaghetti Bolognese
					</StyledText>
					<StyledText type="label" className="text-main">
						@johndoe
					</StyledText>

					<View className="w-full h-[150px] mt-2">
						<Image
							source={images.adobo}
							resizeMode="cover"
							className="w-full h-full rounded-xl object-center"
						/>
					</View>
				</View>

				{/* Ingredients */}
				<View className="w-full flex-col mt-2 ">
					<StyledText
						className="tracking-wider text-main font-chunk"
						type="heading-4">
						Ingredients:
					</StyledText>
					<View className="px-2 flex-col w-full">
						<StyledText type="label" className="py-2 tracking-wide">
							• 1/2 Chicken
						</StyledText>
						<StyledText type="label" className="py-2 tracking-wide">
							• 2 Bayleaf
						</StyledText>
						<StyledText type="label" className="py-2 tracking-wide">
							• Vinegar
						</StyledText>
						<StyledText type="label" className="py-2 tracking-wide">
							• Soy Sauce
						</StyledText>
					</View>
				</View>

				{/* Instructions */}
				<View className="w-full flex-col mt-2 ">
					<StyledText
						className="tracking-wider text-main font-chunk"
						type="heading-4">
						Instructions:
					</StyledText>
					<View className="px-2 flex-col w-full">
						<StyledText type="label" className="py-2 tracking-wide">
							• Clean that chick
						</StyledText>
						<StyledText type="label" className="py-2 tracking-wide">
							• Slice this shits
						</StyledText>
						<StyledText type="label" className="py-2 tracking-wide">
							• Fry those fuckers
						</StyledText>
						<StyledText type="label" className="py-2 tracking-wide">
							• Pour those vinegar and soy sauce
						</StyledText>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

export default RecipePostPage;
