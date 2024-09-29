import {
	View,
	SafeAreaView,
	Image,
	ScrollView,
	Alert,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "../../constants/colors";
import StyledText from "@/components/StyledText";
import StyledTextInput from "@/components/StyledTextInput";
import StyledPressable from "@/components/StyledPressable";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserLoginSchema } from "@/utils/types/user";
import { TUserLogin } from "../../utils/types/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleLogin } from "@/redux/actions/authActions";

const Login = () => {
	const dispatch = useDispatch<AppDispatch>();
	const user = useSelector((state: RootState) => state.auth);
	const { gradientColor, logoImage } = useThemeColors();

	const onSubmit = async (data: TUserLogin) => {
		dispatch(handleLogin(data)).then((res) => {
			if (res.meta.requestStatus === "rejected") {
				Alert.alert(res.payload);
			}
		});
	};

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<TUserLogin>({
		resolver: zodResolver(UserLoginSchema),
	});

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1 }}
			keyboardVerticalOffset={Platform.OS === "ios" ? 60 : -300}>
			<LinearGradient
				start={{ x: 0.9, y: 0.1 }}
				colors={gradientColor}
				className="absolute top-0 left-0 w-full h-full"
			/>
			<SafeAreaView className="relative w-full h-full">
				{/* Circle stays at the bottom */}
				<View className="absolute -bottom-[15%] -left-[30%] w-[300] h-[300] rounded-full bg-light-dark/100  dark:bg-dark" />

				<ScrollView>
					<View className="items-center flex-1 w-full max-h-full min-h-screen p-10 pb-4">
						<View className="items-center w-full max-h-[100px]">
							<Image
								source={logoImage}
								className="w-full h-full "
								resizeMode="contain"
							/>
						</View>
						<StyledText
							type="heading-1"
							fontStyle="ChunkP"
							className="pt-3 text-center">
							Welcome Back
						</StyledText>

						<StyledText
							type="subheading"
							fontStyle="default"
							className="pt-1 text-center ">
							Login to your account.
						</StyledText>

						<View className="flex-1 flex-col ">
							{/* Email Input */}
							<View className="w-full  pt-8">
								<Controller
									control={control}
									name="email"
									render={({ field: { onChange, onBlur, value } }) => (
										<StyledTextInput
											className="w-full"
											title="Email"
											handleTextChange={onChange}
											value={value}
											error={errors.email?.message}
										/>
									)}
								/>
							</View>

							{/* Password Input */}
							<View className="w-full pt-4">
								<Controller
									control={control}
									name="password"
									render={({ field: { onChange, value } }) => (
										<StyledTextInput
											className="w-full"
											title="Password"
											handleTextChange={onChange}
											value={value}
											error={errors.password?.message}
										/>
									)}
								/>
							</View>

							<StyledPressable size="text" className="w-full px-5 mt-4">
								<StyledText selectable={false} fontStyle="default" type="link">
									Forgot Password?
								</StyledText>
							</StyledPressable>
						</View>

						<View className="flex-row items-end mt-12 space-x-2">
							<StyledText selectable={false} fontStyle="default" type="label">
								Don't have an Account?
							</StyledText>

							<StyledPressable
								size="text"
								onPress={() => router.replace("/(auth)/register")}>
								<StyledText
									className=""
									selectable={false}
									fontStyle="default"
									type="link">
									Sign-Up
								</StyledText>
							</StyledPressable>
						</View>

						<StyledPressable
							size="xl"
							className="mt-4 bg-main"
							disabled={user.status === "pending"}
							onPress={handleSubmit(onSubmit)}>
							<StyledText selectable={false} fontStyle="Chunk" type="button">
								{user.status === "pending" ? "Logging in..." : "Log in"}
							</StyledText>
						</StyledPressable>
					</View>
				</ScrollView>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
};

export default Login;
