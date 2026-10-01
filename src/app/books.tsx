import { useColors } from "@/hooks/useColors";
import {
    buildBooksUrl,
    fetchBooks,
    getCoverUrl,
    getPreferredReadUrl,
    GutendexBook,
    resolveNextUrl,
} from "@/services/gutendex";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Linking,
    Platform,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function authorLabel(book: GutendexBook) {
    return (
        book.authors[0]?.name?.split(",").reverse().join(" ").trim() ||
        "Unknown author"
    );
}

function BookCard({
    book,
    onOpen,
}: {
    book: GutendexBook;
    onOpen: (book: GutendexBook) => void;
}) {
    const colors = useColors();
    const cover = getCoverUrl(book);

    return (
        <View style={styles.bookCard}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Open ${book.title}`}
                testID={`book-${book.id}`}
                onPress={() => onOpen(book)}
                style={({ pressed }) => [
                    styles.coverButton,
                    {
                        shadowColor: colors.primary,
                        opacity: pressed ? 0.78 : 1,
                    },
                ]}
            >
                {cover ? (
                    <Image
                        source={{ uri: cover }}
                        style={styles.cover}
                        resizeMode="cover"
                    />
                ) : (
                    <View
                        style={[
                            styles.cover,
                            styles.coverFallback,
                            { backgroundColor: colors.accent },
                        ]}
                    >
                        <Feather name="book" size={25} color={colors.primary} />
                    </View>
                )}
            </Pressable>

            <Text
                numberOfLines={2}
                style={[styles.bookTitle, { color: colors.foreground }]}
            >
                {book.title}
            </Text>
            <Text
                numberOfLines={1}
                style={[styles.bookAuthor, { color: colors.mutedForeground }]}
            >
                {authorLabel(book)}
            </Text>
        </View>
    );
}

export default function BooksScreen() {
    const colors = useColors();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const params = useLocalSearchParams<{
        topic?: string;
        genre?: string;
        saved?: string;
    }>();
    const topic = typeof params.topic === "string" ? params.topic : "fiction";
    const genre = typeof params.genre === "string" ? params.genre : "Fiction";
    const [books, setBooks] = useState<GutendexBook[]>([]);
    const [search, setSearch] = useState("");
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const columns = width >= 900 ? 6 : width >= 650 ? 5 : width >= 440 ? 4 : 3;
    const gridGap = width >= 650 ? 18 : 12;
    const horizontalPadding = width >= 650 ? 32 : 18;

    const loadInitial = useCallback(
        async (signal?: AbortSignal) => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchBooks(
                    buildBooksUrl(topic, search),
                    signal,
                );
                setBooks(data.results);
                setNextUrl(data.next);
            } catch (requestError) {
                if ((requestError as Error).name !== "AbortError")
                    setError(
                        "We could not load this shelf. Check your connection and try again.",
                    );
            } finally {
                if (!signal?.aborted) setIsLoading(false);
            }
        },
        [search, topic],
    );

    useEffect(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const timeout = setTimeout(
            () => void loadInitial(controller.signal),
            280,
        );
        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [loadInitial]);

    const loadMore = async () => {
        if (!nextUrl || isLoadingMore) return;
        setIsLoadingMore(true);
        try {
            const data = await fetchBooks(resolveNextUrl(nextUrl));
            setBooks((current) => [
                ...current,
                ...data.results.filter(
                    (item) => !current.some((book) => book.id === item.id),
                ),
            ]);
            setNextUrl(data.next);
        } catch {
            setError("More books could not be loaded right now.");
        } finally {
            setIsLoadingMore(false);
        }
    };

    const refresh = async () => {
        setIsRefreshing(true);
        await loadInitial();
        setIsRefreshing(false);
    };

    const openBook = async (book: GutendexBook) => {
        const url = getPreferredReadUrl(book);
        if (!url) {
            Alert.alert(
                "No viewable version available",
                "This book does not include an HTML, PDF, or TXT edition.",
            );
            return;
        }
        try {
            await Linking.openURL(url);
        } catch {
            Alert.alert(
                "Could not open book",
                "The selected edition could not be opened on this device.",
            );
        }
    };

    const emptyMessage = search
        ? `No books found for “${search.trim()}”. Try another title or author.`
        : "No books are available in this genre yet.";

    const listHeader = useMemo(
        () => (
            <View
                style={[
                    styles.header,
                    {
                        paddingTop:
                            insets.top + (Platform.OS === "web" ? 67 : 16),
                        paddingHorizontal: horizontalPadding,
                    },
                ]}
            >
                <View style={styles.titleRow}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                        testID="back-button"
                        onPress={() => router.back()}
                        style={({ pressed }) => [
                            styles.backButton,
                            { opacity: pressed ? 0.55 : 1 },
                        ]}
                    >
                        <Feather
                            name="arrow-left"
                            size={24}
                            color={colors.primary}
                        />
                    </Pressable>
                    <View style={styles.titleWrap}>
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.headerTitle,
                                { color: colors.primary },
                            ]}
                        >
                            {genre}
                        </Text>
                        <Text
                            style={[
                                styles.headerSubtitle,
                                { color: colors.mutedForeground },
                            ]}
                        ></Text>
                    </View>
                    <View style={{ width: 42 }} />
                </View>
            </View>
        ),
        [colors, genre, horizontalPadding, insets.top, books.length, search],
    );

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <FlatList
                key={`${columns}-${""}`}
                data={books}
                numColumns={columns}
                renderItem={({ item }) => (
                    <BookCard book={item} onOpen={openBook} />
                )}
                keyExtractor={(item) => String(item.id)}
                ListHeaderComponent={listHeader}
                stickyHeaderIndices={[0]}
                contentContainerStyle={[
                    styles.listContent,
                    {
                        paddingHorizontal: horizontalPadding,
                        paddingBottom:
                            insets.bottom + (Platform.OS === "web" ? 34 : 28),
                        gap: gridGap,
                    },
                ]}
                columnWrapperStyle={columns > 1 ? { gap: gridGap } : undefined}
                onEndReached={loadMore}
                onEndReachedThreshold={0.6}
                scrollEnabled={books.length > 0 || isLoading}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={refresh}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={
                    isLoading ? (
                        <View style={styles.state}>
                            <ActivityIndicator
                                size="small"
                                color={colors.primary}
                            />
                            <Text
                                style={[
                                    styles.stateTitle,
                                    { color: colors.foreground },
                                ]}
                            >
                                Opening the shelf…
                            </Text>
                            <Text
                                style={[
                                    styles.stateText,
                                    { color: colors.mutedForeground },
                                ]}
                            >
                                Finding books with covers for you.
                            </Text>
                        </View>
                    ) : error ? (
                        <View style={styles.state}>
                            <View
                                style={[
                                    styles.stateIcon,
                                    { backgroundColor: colors.accent },
                                ]}
                            >
                                <Feather
                                    name="wifi-off"
                                    size={23}
                                    color={colors.primary}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.stateTitle,
                                    { color: colors.foreground },
                                ]}
                            >
                                Nothing loaded yet
                            </Text>
                            <Text
                                style={[
                                    styles.stateText,
                                    { color: colors.mutedForeground },
                                ]}
                            >
                                {error}
                            </Text>
                            <Pressable
                                testID="retry-button"
                                onPress={() => void loadInitial()}
                                style={[
                                    styles.retryButton,
                                    { backgroundColor: colors.primary },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.retryText,
                                        { color: colors.primaryForeground },
                                    ]}
                                >
                                    Try again
                                </Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View style={styles.state}>
                            <View
                                style={[
                                    styles.stateIcon,
                                    { backgroundColor: colors.accent },
                                ]}
                            >
                                <Feather
                                    name={"search"}
                                    size={23}
                                    color={colors.primary}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.stateTitle,
                                    { color: colors.foreground },
                                ]}
                            >
                                {"No matches"}
                            </Text>
                            <Text
                                style={[
                                    styles.stateText,
                                    { color: colors.mutedForeground },
                                ]}
                            >
                                {emptyMessage}
                            </Text>
                        </View>
                    )
                }
                ListFooterComponent={
                    isLoadingMore ? (
                        <ActivityIndicator
                            color={colors.primary}
                            style={{ paddingVertical: 20 }}
                        />
                    ) : error && books.length > 0 ? (
                        <View
                            style={[
                                styles.inlineError,
                                { backgroundColor: colors.accent },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.inlineErrorText,
                                    { color: colors.foreground },
                                ]}
                            >
                                {error}
                            </Text>
                            <Pressable
                                testID="retry-list-button"
                                onPress={() => void loadInitial()}
                            >
                                <Text
                                    style={[
                                        styles.inlineRetry,
                                        { color: colors.primary },
                                    ]}
                                >
                                    Reload shelf
                                </Text>
                            </Pressable>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { width: "100%", marginBottom: 20 },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    backButton: {
        width: 42,
        height: 42,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    titleWrap: { flex: 1, alignItems: "center" },
    headerTitle: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 27,
        lineHeight: 31,
        fontWeight: "700",
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontFamily: "Montserrat_400Regular",
        fontSize: 12,
        marginTop: 2,
    },
    searchBox: {
        marginTop: 16,
        minHeight: 44,
        borderRadius: 8,
        paddingHorizontal: 13,
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
    },
    searchInput: {
        fontFamily: "Montserrat_400Regular",
        flex: 1,
        fontSize: 15,
        minHeight: 44,
    },
    listContent: { flexGrow: 1 },
    bookCard: { flex: 1, minWidth: 0, position: "relative" },
    coverButton: {
        width: "100%",
        aspectRatio: 0.7,
        borderRadius: 9,
        overflow: "hidden",
        marginBottom: 9,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.11,
        shadowRadius: 8,
        elevation: 3,
    },
    cover: { width: "100%", height: "100%" },
    coverFallback: { alignItems: "center", justifyContent: "center" },
    saveButton: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 29,
        height: 29,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 2,
    },
    bookTitle: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 12,
        lineHeight: 16,
        fontWeight: "700",
        textTransform: "uppercase",
        minHeight: 32,
    },
    bookAuthor: {
        fontFamily: "Montserrat_400Regular",
        fontSize: 12,
        lineHeight: 16,
        marginTop: 3,
    },
    state: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        paddingVertical: 70,
    },
    stateIcon: {
        width: 54,
        height: 54,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    stateTitle: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
    },
    stateText: {
        fontFamily: "Montserrat_400Regular",
        fontSize: 14,
        lineHeight: 21,
        textAlign: "center",
        marginTop: 7,
        maxWidth: 320,
    },
    retryButton: {
        marginTop: 18,
        borderRadius: 9,
        paddingHorizontal: 18,
        paddingVertical: 11,
    },
    retryText: { fontSize: 14, fontWeight: "700" },
    inlineError: {
        marginTop: 8,
        marginBottom: 18,
        borderRadius: 10,
        padding: 14,
        alignItems: "center",
    },
    inlineErrorText: { fontSize: 13, textAlign: "center", lineHeight: 19 },
    inlineRetry: { fontSize: 13, fontWeight: "700", marginTop: 8 },
});
