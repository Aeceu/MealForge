import { useColorScheme } from "nativewind";

export const useThemeColors = () => {
  const { colorScheme } = useColorScheme();

  const gradientColor =
    colorScheme === "light" ? ["#BBA78D", "#FFEDD5"] : ["#151210", "#201D1C"];

  const logoImage =
    colorScheme === "dark"
      ? require("@/assets/images/logo-light.png")
      : require("@/assets/images/logo-dark.png");

  const textColor =
    colorScheme === "light" ? "text-dark" : "text-light";

  const statusColor =
    colorScheme === "light" ? "dark" : "light";

  const placeholderColor =
    colorScheme === "light" ? "#BBA78D" : "#3A3A3A";

  return { gradientColor, logoImage, textColor, statusColor, placeholderColor };
};
