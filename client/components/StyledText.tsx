import { useColorScheme } from "nativewind";
import { Text, type TextProps } from "react-native";

type Props = TextProps & {
	type?: "default" | "title" | "subtitle" | "link" | "semibold" | "bold" | "light";
	fontStyle?: "default" | "light" | "Makeba" | "Chunk";
};

const StyledText = ({
	type = "default",
	fontStyle = "default",
	...rest
}: Props) => {
	const { colorScheme } = useColorScheme();
	return (
		<Text
			className={` 
				${colorScheme === "light" ? "text-dark" : "text-light"}

				${fontStyle === "default" && "font-pregular"}
				${fontStyle === "Makeba" && "font-makeba"}
				${fontStyle === "Chunk" && "font-chunk"}
				${fontStyle === "light" && "font-plight"}

				${type === "default" && "text-[16px] leading-6"}
				${type === "light" && "text-[16px] leading-6"}
				${type === "semibold" && "text-[16px] leading-6"}
				${type === "bold" && "text-[16px] leading-6"}
				${type === "title" && "text-[32px] leading-8"}
				${type === "subtitle" && "text-[20px]"}
				${type === "link" && "text-[16px] leading-[30px] text-gray"}

				`}
			{...rest}
		/>
	);
};
export default StyledText;
