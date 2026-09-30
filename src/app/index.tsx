import { router } from "expo-router";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { GenreCard } from "@/components/GenreCard";
import { GENRES } from "@/constants/genres";
import { colors, spacing, typography } from "@/theme";

export default function HomeScreen() {
    const { width, height } = useWindowDimensions();

    const isLandscape = width > height;

    const handleGenrePress = (genre: string) => {
        router.push({
            pathname: "/books/[genre]",
            params: {
                genre,
            },
        });
    };

    return (
        <View style={styles.container}>
            <View
                style={[styles.content, isLandscape && styles.contentLandscape]}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Gutenberg</Text>

                    <Text style={styles.description}>
                        A social cataloging website that allows you to freely
                        search its database of books, annotations, and reviews.
                    </Text>
                </View>

                <View
                    style={[
                        styles.genreGrid,
                        isLandscape && styles.genreGridLandscape,
                    ]}
                >
                    {GENRES.map((genre) => (
                        <View
                            key={genre}
                            style={[
                                styles.genreItem,
                                isLandscape && styles.genreItemLandscape,
                            ]}
                        >
                            <GenreCard
                                genre={genre}
                                onPress={() => handleGenrePress(genre)}
                            />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        flex: 1,
        width: "100%",
        maxWidth: 800,
        alignSelf: "center",

        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xxxl,
    },

    contentLandscape: {
        paddingTop: spacing.xl,
        paddingBottom: spacing.xl,
    },

    header: {
        alignItems: "center",
    },

    title: {
        color: colors.primary,
        fontFamily: typography.heading1.fontFamily,
        fontSize: typography.heading1.fontSize,
        lineHeight: 58,
        textAlign: "center",
    },

    description: {
        maxWidth: 700,
        marginTop: spacing.lg,

        color: colors.text,
        fontFamily: typography.body.fontFamily,
        fontSize: typography.body.fontSize,
        lineHeight: 24,
        textAlign: "center",
    },

    genreGrid: {
        marginTop: spacing.xxxl,
        gap: spacing.md,
    },

    genreGridLandscape: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: spacing.md,
    },

    genreItem: {
        width: "100%",
    },

    genreItemLandscape: {
        width: "31%",
    },
});
