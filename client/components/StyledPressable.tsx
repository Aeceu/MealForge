import { TouchableOpacity, type TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
	size?: "default" | "link" | "sm" | "lg" | "xl";
};

const StyledPressable = ({ size = "default", ...rest }: Props) => {
	return (
		<TouchableOpacity
			className={`
        ${size === "sm" && "w-1/4 py-2"}
        ${size === "default" && "w-1/2 py-3"}
        ${size === "lg" && "w-3/4 py-4"}
        ${size === "xl" && "w-full py-4"}
         rounded-md items-center justify-center `}
			{...rest}
		/>
	);
};
export default StyledPressable;
