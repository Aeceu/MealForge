import { useColorScheme } from "nativewind";
import { Text, type TextProps } from "react-native";

type Props = TextProps & {
	type?: "default" | "title" | "subtitle" | "link" | "semibold" | "bold";
	fontStyle?: "default" | "Makeba";
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
    ${colorScheme === "light" ? "text-dark-shade" : "text-light-shade"}
    ${type === "default" && "text-[16px] leading-6 font-pregular"}
    ${type === "semibold" && "text-[16px] leading-6 font-psemibold"}
    ${type === "bold" && "text-[16px] leading-6 font-pbold"}
    ${type === "title" && "text-[32px] leading-8"}
    ${type === "subtitle" && "text-[20px] font-light"}
    ${
			type === "link" && "text-[16px] leading-[30px] text-gray-shade font-pthin"
		}
    `}
			{...rest}
		/>
	);
};
export default StyledText;
