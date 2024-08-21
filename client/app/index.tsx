import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const index = () => {
	return (
		<SafeAreaView className="w-full h-full items-center justify-center">
			<View>
				<Text className="text-4xl font-bold">Welcome to MealForge!</Text>
			</View>
		</SafeAreaView>
	);
};
export default index;
