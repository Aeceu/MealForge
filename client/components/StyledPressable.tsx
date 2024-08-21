import { TouchableOpacity, type TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
	type?: "default" | "link" | "sm" | "lg" | "xl";
};

const StyledPressable = ({ type = "default", ...rest }: Props) => {
	return (
		<TouchableOpacity
			className={`
        ${type === "sm" && "w-1/4 py-2"}
        ${type === "default" && "w-1/2 py-3"}
        ${type === "lg" && "w-3/4 py-4"}
        ${type === "xl" && "w-full py-4"}
        bg-orange-500 rounded-md items-center justify-center `}
			{...rest}
		/>
	);
};
export default StyledPressable;
