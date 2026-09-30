import { Pressable, StyleSheet, Text } from "react-native";

import { colors, spacing, typography } from "@/theme";

type GenreCardProps = {
    genre: string;
    onPress: () => void;
};

export function GenreCard({ genre, onPress }: GenreCardProps) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open ${genre} books`}
            onPress={onPress}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
            <Text style={styles.label}>{genre.toUpperCase()}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        height: 50,
        width: "100%",
        minWidth: 0,

        alignItems: "center",
        justifyContent: "center",

        paddingHorizontal: spacing.md,

        backgroundColor: colors.surface,
        borderRadius: 4,

        shadowColor: "#D3D1EE",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,

        elevation: 2,
    },

    pressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },

    label: {
        color: colors.text,
        fontFamily: typography.genre.fontFamily,
        fontSize: typography.genre.fontSize,
    },
});
