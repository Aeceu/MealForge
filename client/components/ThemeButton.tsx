import { styled, useColorScheme } from "nativewind";
import StyledText from "./StyledText";
import { Pressable } from "react-native";

const StyledPressable = styled(Pressable);
const ThemeButton = () => {
	const { colorScheme, toggleColorScheme } = useColorScheme();
	return (
		<StyledPressable onPress={toggleColorScheme} className="  ">
			<StyledText
				selectable={false}
				className={`${
					colorScheme === "light" ? "bg-dark-shade" : "bg-light-shade"
				}  text-xl py-2 px-2.5 rounded-full`}>
				{`${colorScheme === "dark" ? "🌙" : "🌞"}`}
			</StyledText>
		</StyledPressable>
	);
};
export default ThemeButton;
