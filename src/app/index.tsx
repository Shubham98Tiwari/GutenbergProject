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

const genres = [
    { label: "Fiction", query: "fiction", icon: "flask-outline" as const },
    { label: "Drama", query: "drama", icon: "drama-masks" as const },
    { label: "Humour", query: "humour", icon: "emoticon-outline" as const },
    {
        label: "Politics",
        query: "politics",
        icon: "account-tie-outline" as const,
    },
    { label: "Philosophy", query: "philosophy", icon: "yin-yang" as const },
    { label: "History", query: "history", icon: "bank-outline" as const },
    {
        label: "Adventure",
        query: "adventure",
        icon: "compass-outline" as const,
    },
];

export default function HomeScreen() {
    const colors = useColors();
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const { width } = useWindowDimensions();
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
                </View>

                <View style={styles.intro}>
                    <Text style={[styles.title, { color: colors.foreground }]}>
                        Gutenberg{"\n"}Project
                    </Text>
                    <Text
                        style={[
                            styles.description,
                            { color: colors.mutedForeground },
                        ]}
                    >
                        Freely explore a living library of books, stories, and
                        ideas from Project Gutenberg.
                    </Text>
                </View>

                <View style={styles.sectionHeading}>
                    <Text
                        style={[
                            styles.sectionKicker,
                            { color: colors.primary },
                        ]}
                    >
                        Browse by mood
                    </Text>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: colors.foreground },
                        ]}
                    >
                        Find your next read
                    </Text>
                </View>

                <View
                    style={[styles.genreGrid, isWide && styles.genreGridWide]}
                >
                    {genres.map((genre) => (
                        <Pressable
                            key={genre.query}
                            accessibilityRole="button"
                            accessibilityLabel={`Browse ${genre.label}`}
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
                        “A reader lives a thousand lives before he dies.”
                    </Text>
                    <Text
                        style={[
                            styles.quoteAuthor,
                            { color: colors.primaryForeground },
                        ]}
                    >
                        — George R. R. Martin
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
