import { Image, Modal, ScrollView, View } from "react-native";
import StyledText from "../StyledText";
import StyledPressable from "../StyledPressable";
import { useColorScheme } from "nativewind";
import { icons, images } from "@/constants"; 
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleSaveRecipe } from "@/redux/actions/recipeAction";

type Props = {
	isVisible: boolean;
	onClose: () => void;
	recipe:{
		name:string;
		ingredients:[
			{
				name:string;
				measurement:string;
			}
		]
		instructions:[string];
		type_of_cuisine:string;
		nutrient_counts:string;
		serve_hot_or_cold:string;
		cooking_time:string;
		benefits:string;
		serve_for:string;
	}|null
};
 

const DisplayRecipe: React.FC<Props> = ({ isVisible, onClose,recipe }) => {
	const {colorScheme} = useColorScheme()
	const dispatch = useDispatch<AppDispatch>()
	const {user} = useSelector((state:RootState)=> state.user)

	const handleClose = () => {
		onClose();
	};

	const handleDelete = () => {
		onClose()
	}

	const handleSave = async () => {
		if(recipe){	
			dispatch(handleSaveRecipe({
				userId:user?.id,
				recipe
			})).then((res)=>{
				if(res.meta.requestStatus === "fulfilled"){
					onClose()
				}
			})
		}
	}

	return (
		<Modal
			visible={isVisible}
			transparent={true}
			animationType="slide"
			className="bg-black">
			<View className="z-10 flex-1">
				<View  className="absolute bottom-0 w-full  border bg-light h-[90%] rounded-t-3xl border-light-dark dark:border-dark-light dark:bg-dark">
					<ScrollView>
						<View className="flex-row items-center justify-between bg-main p-4 rounded-t-3xl">
							<StyledText type="heading-4">Generated Recipe</StyledText>
							<StyledPressable onPress={handleClose} size="icon">
								<Image
									source={
										colorScheme === "light"
											? icons.closeDarkLight
											: icons.closeLightDark
									}
									className="w-8 h-8"
								/>
							</StyledPressable>
						</View>

						<View className="flex-col items-start justify-start">
							{/* Header */}
							<View className="w-full flex-col items-start justify-start p-4">
								<StyledText type="heading-2" className="font-chunk">
									{recipe?.name}
								</StyledText> 
							</View>

							{/* Infos */}
							<View className="w-full flex-col p-4">
								<StyledText
									className="tracking-wider text-main font-chunk"
									type="heading-4">
									Infos:
								</StyledText> 
									<View className="flex-col items-start justify-center w-full ">
										<View className="flex-row items-center px-3 bg-light-dark dark:bg-dark-light py-1.5 my-1 rounded-full w-max ">
											<StyledText type="label">Serve for: </StyledText>
											<StyledText type="label" >{recipe?.serve_for} people </StyledText>
										</View>
										<View className="flex-row items-center px-3 bg-light-dark dark:bg-dark-light py-1.5 my-1 rounded-full w-max ">
											<StyledText type="label">Serve in: </StyledText>
											<StyledText type="label" >{recipe?.serve_hot_or_cold} </StyledText>
										</View>
										<View className="flex-row items-center px-3 bg-light-dark dark:bg-dark-light py-1.5 my-1 rounded-full w-max ">
											<StyledText type="label">Cooking time: </StyledText>
											<StyledText type="label" >{recipe?.cooking_time} minutes </StyledText>
										</View>
										<View className="flex-row items-center px-3 bg-light-dark dark:bg-dark-light py-1.5 my-1 rounded-full w-max ">
											<StyledText type="label">Cuisine type: </StyledText>
											<StyledText type="label" >{recipe?.type_of_cuisine} </StyledText>
										</View>
									</View> 
							</View>

							{/* Ingredients */}
							<View className="w-full flex-col  p-4">
								<StyledText
									className="tracking-wider text-main font-chunk"
									type="heading-4">
									Ingredients:
								</StyledText>
								<View className="px-2 flex-col w-full">
									{
									recipe?.ingredients.map((item,i)=>(
										<StyledText key={i} type="label" className="py-2 tracking-wide">
										• {item.name}
										</StyledText>
									))
									} 
								</View>
							</View>

							{/* Instructions */}
							<View className="w-full flex-col  p-4">
								<StyledText
									className="tracking-wider text-main font-chunk"
									type="heading-4">
									Instructions:
								</StyledText>
								<View className="px-2 flex-col w-full">
								{
									recipe?.instructions.map((item,i)=>(
										<StyledText key={i} type="label" className="py-2 tracking-wide">
										• {item}
										</StyledText>
									))
									} 
								</View>
							</View>
							
							<View className="w-full flex-row items-center justify-end p-4">
								<StyledPressable onPress={handleSave} className="bg-main mx-1 rounded-md" size="sm">
									<StyledText>
										Save
									</StyledText>
								</StyledPressable>
								<StyledPressable onPress={handleDelete} className="bg-red-500 mx-1 rounded-md" size="sm">
									<StyledText>
										Delete
									</StyledText>
								</StyledPressable>
							</View>	
						</View>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
};
export default DisplayRecipe;
