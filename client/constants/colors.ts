import { useColorScheme } from "nativewind";
import icons from "./icons";

export const useThemeColors = () => {
	const { colorScheme } = useColorScheme();

	const colors = {
		dark: "#151210", // eto main dark color natin
		light: "#FEDAAA", // eto main light color natin
		gray: "#3A3A3A", // light mode placeholder
		lightDark: "#BBA78D", // darkmode placeholder
		darkLight: "#201D1C", // used in gradient
		// TODO: add new color for inactive tab icons and text (light and dark mode)
	};

	const gradientColor =
		colorScheme === "light"
			? [colors.lightDark, colors.light]
			: [colors.dark, colors.darkLight];

	const logoImage = colorScheme === "dark" ? icons.logo_light : icons.logo_dark;
	const textColor = colorScheme === "light" ? colors.dark : colors.light;
	const backgroundColor = colorScheme === "dark" ? colors.dark : colors.light;
	const inActiveColor = colorScheme === "light" ? colors.dark : colors.light;
	const statusColor = colorScheme === "light" ? colors.dark : colors.light;
	const placeholderColor =
		colorScheme === "light" ? colors.lightDark : colors.gray;

	return {
		inActiveColor,
		gradientColor,
		logoImage,
		textColor,
		statusColor,
		backgroundColor,
		placeholderColor,
	};
};
