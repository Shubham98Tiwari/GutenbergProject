import colors from "@/constants/colors";
import { useColorScheme } from "react-native";

export function useColors() {
    const scheme = useColorScheme();
    const palette =
        scheme === "dark" && "dark" in colors ? colors.dark : colors.light;
    return { ...palette, radius: colors.radius };
}
