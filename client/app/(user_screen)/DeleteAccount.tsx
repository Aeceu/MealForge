import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import { icons } from "@/constants";
import { useColorScheme } from "nativewind";
import { Alert, Image, ScrollView, View } from "react-native";
import { router, useRouter } from "expo-router"; // Import Expo Router for navigation
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { deleteAccount } from "@/redux/actions/userActions";
import { clearToken } from "@/redux/slices/authSlice";

const DeleteAccount = () => {
	const { user, status } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch<AppDispatch>();

	const handleDelete = () => {
		if (!user) {
			return Alert.alert("User not found!");
		}
		dispatch(deleteAccount(user.id)).then((res) => {
			if (res.meta.requestStatus === "fulfilled") {
				dispatch(clearToken());
				Alert.alert(res.payload.message);
				router.push("/(auth)/login");
			}
		});
	};

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			className="w-full h-full bg-light dark:bg-dark flex-col  p-4">
			<View className="w-full h-full flex-col items-center justify-between">
				<View className="w-full h-full flex-1">
					<StyledText
						type="heading-3"
						className="font-bold text-red-500 text-center mb-6">
						Are you sure you want to permanently delete your account?
					</StyledText>

					<StyledText type="label">
						By deleting your account, the following will happen:
					</StyledText>
					<StyledText
						type="label"
						className="text-rose-600 dark:text-rose-400 mt-2">
						• All your personal information will be erased.
					</StyledText>
					<StyledText
						type="label"
						className="text-rose-600 dark:text-rose-400 mt-2">
						• All your personal preferences will be erased.
					</StyledText>
					<StyledText
						type="label"
						className="text-rose-600 dark:text-rose-400 mt-2">
						• All your ingredients and recipes will be erased.
					</StyledText>
					<StyledText
						type="label"
						className="text-rose-600 dark:text-rose-400 mt-1">
						• You will lose access to saved content and settings.
					</StyledText>
					<StyledText
						type="label"
						className="text-rose-600 dark:text-rose-400 mt-1">
						• This action is{" "}
						<StyledText className="font-bold text-red-500 ">
							irreversible
						</StyledText>{" "}
						and cannot be undone.
					</StyledText>
				</View>

				<StyledPressable
					disabled={status === "pending"}
					onPress={handleDelete}
					size="xl"
					className="bg-red-600 p-4 w-full rounded-lg mb-4">
					<StyledText className="text-white text-center font-semibold">
						{status === "pending"
							? "Deleting Account . . . ."
							: "Delete Account"}
					</StyledText>
				</StyledPressable>
			</View>
		</ScrollView>
	);
};

export default DeleteAccount;
