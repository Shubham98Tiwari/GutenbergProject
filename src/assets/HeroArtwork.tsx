import { useColors } from "@/hooks/useColors";
import { StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
export default function HeroArtwork() {
    const colors = useColors();

    return (
        <Svg
            style={styles.heroArtwork}
            width="100%"
            height="280"
            viewBox="0 0 390 280"
            preserveAspectRatio="xMidYMin slice"
        >
            <Path
                d="M-25 35 C24 0 63 8 99 42 S160 82 205 49 284 3 333 35 376 70 420 47"
                fill="none"
                stroke={colors.primary}
                strokeOpacity={0.1}
            />
            <Path
                d="M-25 48 C24 13 63 21 99 55 S160 95 205 62 284 16 333 48 376 83 420 60"
                fill="none"
                stroke={colors.primary}
                strokeOpacity={0.1}
            />
            <Path
                d="M-25 61 C24 26 63 34 99 68 S160 108 205 75 284 29 333 61 376 96 420 73"
                fill="none"
                stroke={colors.primary}
                strokeOpacity={0.1}
            />
            <Path
                d="M-25 74 C24 39 63 47 99 81 S160 121 205 88 284 42 333 74 376 109 420 86"
                fill="none"
                stroke={colors.primary}
                strokeOpacity={0.1}
            />
            <Path
                d="M-25 87 C24 52 63 60 99 94 S160 134 205 101 284 55 333 87 376 122 420 99"
                fill="none"
                stroke={colors.primary}
                strokeOpacity={0.1}
            />
            <Path
                d="M-25 100 C24 65 63 73 99 107 S160 147 205 114 284 68 333 100 376 135 420 112"
                fill="none"
                stroke={colors.primary}
                strokeOpacity={0.1}
            />
            <Path
                d="M-25 113 C24 78 63 86 99 120 S160 160 205 127 284 81 333 113 376 148 420 125"
                fill="none"
                stroke={colors.primary}
                strokeOpacity={0.1}
            />
            <Path
                d="M-25 126 C24 91 63 99 99 133 S160 173 205 140 284 94 333 126 376 161 420 138"
                fill="none"
                stroke={colors.primary}
                strokeOpacity={0.1}
            />
        </Svg>
    );
}
const styles = StyleSheet.create({
    heroArtwork: {
        position: "absolute",
        top: -18,
        left: 0,
        right: 0,
        pointerEvents: "none",
    },
});
