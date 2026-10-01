import copy from "@/constants/copy";
import { useSavedBooks } from "@/context/saved-books";
import { useColors } from "@/hooks/useColors";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    useWindowDimensions,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const genres = [
    {
        label: copy.home.genres.fiction,
        query: "fiction",
        icon: "flask-outline" as const,
    },
    {
        label: copy.home.genres.drama,
        query: "drama",
        icon: "drama-masks" as const,
    },
    {
        label: copy.home.genres.humour,
        query: "humour",
        icon: "emoticon-outline" as const,
    },
    {
        label: copy.home.genres.politics,
        query: "politics",
        icon: "account-tie-outline" as const,
    },
    {
        label: copy.home.genres.philosophy,
        query: "philosophy",
        icon: "yin-yang" as const,
    },
    {
        label: copy.home.genres.history,
        query: "history",
        icon: "bank-outline" as const,
    },
    {
        label: copy.home.genres.adventure,
        query: "adventure",
        icon: "compass-outline" as const,
    },
];

export default function HomeScreen() {
    const colors = useColors();
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const { width } = useWindowDimensions();
    const { savedBooks } = useSavedBooks();
    const isWide = width >= 700;

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <StatusBar
                barStyle={
                    colorScheme === "dark" ? "light-content" : "dark-content"
                }
            />
            <ScrollView
                contentContainerStyle={[
                    styles.content,
                    {
                        paddingTop:
                            insets.top + (Platform.OS === "web" ? 67 : 24),
                        paddingBottom:
                            insets.bottom + (Platform.OS === "web" ? 34 : 28),
                    },
                    isWide && styles.wideContent,
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.hero}>
                    <Svg
                        pointerEvents="none"
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

                    <View style={styles.header}>
                        <View
                            style={[
                                styles.mark,
                                { backgroundColor: colors.primary },
                            ]}
                        >
                            <Feather
                                name="book-open"
                                size={22}
                                color={colors.primaryForeground}
                            />
                        </View>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={copy.home.savedBooks}
                            testID="saved-books-button"
                            onPress={() =>
                                router.push({
                                    pathname: "/books",
                                    params: { saved: "true", genre: "Saved" },
                                })
                            }
                            style={({ pressed }) => [
                                styles.savedButton,
                                { opacity: pressed ? 0.7 : 1 },
                            ]}
                        >
                            <Feather
                                name="bookmark"
                                size={18}
                                color={colors.primary}
                            />
                            {savedBooks.length > 0 && (
                                <View
                                    style={[
                                        styles.countBadge,
                                        { backgroundColor: colors.primary },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.countText,
                                            { color: colors.primaryForeground },
                                        ]}
                                    >
                                        {savedBooks.length}
                                    </Text>
                                </View>
                            )}
                        </Pressable>
                    </View>

                    <View style={styles.intro}>
                        <Text style={[styles.title, { color: colors.primary }]}>
                            {copy.home.title}
                        </Text>
                        <Text
                            style={[
                                styles.description,
                                { color: colors.mutedForeground },
                            ]}
                        >
                            {copy.home.description}
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionHeading}>
                    <Text
                        style={[
                            styles.sectionKicker,
                            { color: colors.primary },
                        ]}
                    >
                        {copy.home.sectionKicker}
                    </Text>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: colors.foreground },
                        ]}
                    >
                        {copy.home.sectionTitle}
                    </Text>
                </View>

                <View
                    style={[styles.genreGrid, isWide && styles.genreGridWide]}
                >
                    {genres.map((genre) => (
                        <Pressable
                            key={genre.query}
                            accessibilityRole="button"
                            accessibilityLabel={copy.home.browseGenre(
                                genre.label,
                            )}
                            testID={`genre-${genre.query}`}
                            onPress={() =>
                                router.push({
                                    pathname: "/books",
                                    params: {
                                        topic: genre.query,
                                        genre: genre.label,
                                    },
                                })
                            }
                            style={({ pressed }) => [
                                styles.genreCard,
                                isWide && styles.genreCardWide,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                    shadowColor: colors.primary,
                                    opacity: pressed ? 0.78 : 1,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.genreIcon,
                                    { backgroundColor: colors.accent },
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name={genre.icon}
                                    size={20}
                                    color={colors.primary}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.genreText,
                                    { color: colors.foreground },
                                ]}
                            >
                                {genre.label}
                            </Text>
                            <Feather
                                name="arrow-up-right"
                                size={19}
                                color={colors.primary}
                            />
                        </Pressable>
                    ))}
                </View>

                <View
                    style={[
                        styles.quoteCard,
                        { backgroundColor: colors.primary },
                    ]}
                >
                    <MaterialCommunityIcons
                        name="format-quote-open"
                        size={34}
                        color={colors.primaryForeground}
                    />
                    <Text
                        style={[
                            styles.quote,
                            { color: colors.primaryForeground },
                        ]}
                    >
                        {copy.home.quote}
                    </Text>
                    <Text
                        style={[
                            styles.quoteAuthor,
                            { color: colors.primaryForeground },
                        ]}
                    >
                        {copy.home.quoteAuthor}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingHorizontal: 22 },
    wideContent: { maxWidth: 920, alignSelf: "center", width: "100%" },
    hero: {
        position: "relative",
        marginHorizontal: -22,
        paddingHorizontal: 22,
        paddingBottom: 12,
        overflow: "hidden",
    },
    heroArtwork: { position: "absolute", top: -18, left: 0, right: 0 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    mark: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    savedButton: {
        minWidth: 44,
        minHeight: 44,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    countBadge: {
        position: "absolute",
        top: 2,
        right: 0,
        minWidth: 17,
        height: 17,
        paddingHorizontal: 4,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    countText: { fontSize: 10, fontWeight: "700" },
    intro: { marginTop: 38, maxWidth: 560 },
    title: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 44,
        lineHeight: 48,
        fontWeight: "700",
        letterSpacing: -1.2,
    },
    description: {
        fontFamily: "Montserrat_400Regular",
        fontSize: 16,
        lineHeight: 24,
        marginTop: 16,
        maxWidth: 400,
    },
    sectionHeading: { marginTop: 48, marginBottom: 16 },
    sectionKicker: {
        textTransform: "uppercase",
        fontSize: 12,
        letterSpacing: 1.6,
        fontWeight: "700",
    },
    sectionTitle: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 24,
        lineHeight: 30,
        fontWeight: "700",
        marginTop: 4,
    },
    genreGrid: { gap: 10 },
    genreGridWide: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    genreCard: {
        minHeight: 64,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 2,
    },
    genreCardWide: { flexBasis: "48%", flexGrow: 1 },
    genreIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    genreText: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 17,
        fontWeight: "600",
        flex: 1,
    },
    quoteCard: {
        marginTop: 36,
        borderRadius: 18,
        padding: 22,
        minHeight: 150,
        justifyContent: "center",
    },
    quote: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 18,
        lineHeight: 26,
        fontWeight: "600",
        marginTop: 4,
    },
    quoteAuthor: { fontSize: 12, opacity: 0.8, marginTop: 12 },
});
