import Loading from "@/components/Loading";
import StyledPressable from "@/components/StyledPressable";
import StyledText from "@/components/StyledText";
import StyledTextInput from "@/components/StyledTextInput";
import { icons, images } from "@/constants";
import { handleRefresh } from "@/redux/actions/authActions";
import { RootState, AppDispatch } from "@/redux/store";
import { TUserSignup, UserSignupSchema } from "@/utils/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useColorScheme } from "nativewind";
import { Controller, useForm } from "react-hook-form";
import { Image, RefreshControl, ScrollView, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

const EditInformation = () => {
	const { user } = useSelector((state: RootState) => state.user);
	const { colorScheme } = useColorScheme();
	const { pageLoading, accessToken } = useSelector(
		(state: RootState) => state.auth
	);
	const dispatch = useDispatch<AppDispatch>();
	const onRefresh = async () => {
		await dispatch(handleRefresh(accessToken));
	};

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<TUserSignup>({
		resolver: zodResolver(UserSignupSchema),
		defaultValues: {
			userName: user?.userName,
			email: user?.email,
			firstName: user?.firstName,
			lastName: user?.lastName,
		},
	});

	if (pageLoading) return <Loading />;
	return (
		<ScrollView
			className="w-full h-full bg-light dark:bg-dark"
			refreshControl={
				<RefreshControl refreshing={pageLoading} onRefresh={onRefresh} />
			}>
			<View className="w-full h-full flex-col items-center  p-4">
				<Image
					source={images.loading_light}
					resizeMode="contain"
					className="w-[80px] h-[80px]"
				/>

				<View className="mt-2 w-full flex-row items-center justify-center">
					<StyledPressable className="bg-light-dark dark:bg-dark-light">
						<StyledText type="label">Change Profile</StyledText>
					</StyledPressable>
				</View>

				<View className="flex-1">
					<View className="w-full pt-8">
						<Controller
							control={control}
							name="userName"
							render={({ field: { onChange, onBlur, value } }) => (
								<StyledTextInput
									className="w-full"
									title="Username"
									handleTextChange={onChange}
									value={value}
									error={errors.userName?.message}
								/>
							)}
						/>
					</View>

					<View className="w-full flex-row pt-4">
						<View className="flex-1 mr-2">
							<Controller
								control={control}
								name="firstName"
								render={({ field: { onChange, onBlur, value } }) => (
									<StyledTextInput
										className="w-full"
										title="Firstname"
										handleTextChange={onChange}
										value={value}
										error={errors.firstName?.message}
									/>
								)}
							/>
						</View>
						<View className="flex-1 ml-2">
							<Controller
								control={control}
								name="lastName"
								render={({ field: { onChange, onBlur, value } }) => (
									<StyledTextInput
										className="w-full"
										title="Lastname"
										handleTextChange={onChange}
										value={value}
										error={errors.lastName?.message}
									/>
								)}
							/>
						</View>
					</View>

					<View className="w-full pt-4">
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
				</View>

				<View className="w-full flex-row items-center justify-end mt-8">
					<StyledPressable className="rounded-md bg-light-dark dark:bg-dark-light">
						<StyledText type="subheading" className="text-emerald-500">
							Save changes
						</StyledText>
					</StyledPressable>
				</View>
			</View>
		</ScrollView>
	);
};
export default EditInformation;
