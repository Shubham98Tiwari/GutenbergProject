import copy from "@/constants/copy";
import { useSavedBooks } from "@/context/saved-books";
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
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function authorLabel(book: GutendexBook) {
    return (
        book.authors[0]?.name?.split(",").reverse().join(" ").trim() ||
        copy.books.unknownAuthor
    );
}

function BookCard({
    book,
    onOpen,
    cardWidth,
}: {
    book: GutendexBook;
    onOpen: (book: GutendexBook) => void;
    cardWidth: number;
}) {
    const colors = useColors();
    const { isSaved, toggleSaved } = useSavedBooks();
    const cover = getCoverUrl(book);
    const saved = isSaved(book.id);

    const handleSave = () => {
        toggleSaved(book);
    };

    return (
        <View style={[styles.bookCard, { width: cardWidth }]}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={copy.books.openBook(book.title)}
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
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                    saved
                        ? copy.books.removeSavedBook(book.title)
                        : copy.books.saveBook(book.title)
                }
                testID={`save-${book.id}`}
                onPress={handleSave}
                style={({ pressed }) => [
                    styles.saveButton,
                    {
                        backgroundColor: colors.card,
                        shadowColor: colors.foreground,
                        opacity: pressed ? 0.7 : 1,
                    },
                ]}
            >
                <Feather
                    name={saved ? "bookmark" : "bookmark"}
                    size={15}
                    color={saved ? colors.primary : colors.mutedForeground}
                    fill={saved ? colors.primary : "transparent"}
                />
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
    const genre =
        typeof params.genre === "string"
            ? params.genre
            : copy.books.defaultGenre;
    const isSavedRoute = params.saved === "true";
    const { savedBooks } = useSavedBooks();
    const [books, setBooks] = useState<GutendexBook[]>([]);
    const [search, setSearch] = useState("");
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(!isSavedRoute);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const columns = width >= 900 ? 6 : width >= 650 ? 5 : width >= 440 ? 4 : 3;
    const gridGap = width >= 650 ? 18 : 12;
    const horizontalPadding = width >= 650 ? 32 : 18;
    const cardWidth =
        (width - horizontalPadding * 2 - gridGap * (columns - 1)) / columns;

    const loadInitial = useCallback(
        async (signal?: AbortSignal) => {
            if (isSavedRoute) return;
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
                    setError(copy.books.initialLoadError);
            } finally {
                if (!signal?.aborted) setIsLoading(false);
            }
        },
        [isSavedRoute, search, topic],
    );

    useEffect(() => {
        if (!isSavedRoute) return;
        setBooks(savedBooks);
        setIsLoading(false);
    }, [isSavedRoute, savedBooks]);

    useEffect(() => {
        if (isSavedRoute) return;
        const controller = new AbortController();
        const timeout = setTimeout(
            () => void loadInitial(controller.signal),
            280,
        );
        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [isSavedRoute, loadInitial]);

    const loadMore = async () => {
        if (!nextUrl || isLoadingMore || isSavedRoute) return;
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
            setError(copy.books.moreBooksError);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const refresh = useCallback(async () => {
        if (isSavedRoute || isRefreshing || isLoading) return;
        setIsRefreshing(true);
        try {
            await loadInitial();
        } finally {
            setIsRefreshing(false);
        }
    }, [isSavedRoute, isRefreshing, isLoading, loadInitial]);

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

    const emptyMessage = isSavedRoute
        ? copy.books.savedEmptyMessage
        : search.trim()
          ? copy.books.noSearchResults(search.trim())
          : copy.books.noGenreBooks;

    const listHeader = useMemo(
        () => (
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: colors.background,
                        paddingTop:
                            insets.top + (Platform.OS === "web" ? 67 : 16),
                        paddingHorizontal: horizontalPadding,
                    },
                ]}
            >
                <View style={styles.titleRow}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={copy.books.back}
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
                        >
                            {isSavedRoute
                                ? copy.books.savedCount(books.length)
                                : copy.books.shelfSubtitle}
                        </Text>
                    </View>
                    <View style={styles.headerAction}>
                        {!isSavedRoute && (
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={
                                    isRefreshing
                                        ? copy.books.refreshingBooks
                                        : copy.books.refreshBooks
                                }
                                testID="refresh-books-button"
                                disabled={isRefreshing || isLoading}
                                onPress={() => void refresh()}
                                style={({ pressed }) => [
                                    styles.refreshButton,
                                    {
                                        backgroundColor: colors.secondary,
                                        opacity:
                                            isRefreshing || isLoading
                                                ? 0.55
                                                : pressed
                                                  ? 0.7
                                                  : 1,
                                    },
                                ]}
                            >
                                {isRefreshing || isLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={colors.primary}
                                    />
                                ) : (
                                    <Feather
                                        name="refresh-cw"
                                        size={15}
                                        color={colors.primary}
                                    />
                                )}
                                <Text
                                    style={[
                                        styles.refreshText,
                                        { color: colors.primary },
                                    ]}
                                >
                                    {copy.books.refreshAction}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </View>
                {!isSavedRoute && (
                    <View
                        style={[
                            styles.searchBox,
                            { backgroundColor: colors.secondary },
                        ]}
                    >
                        <Feather
                            name="search"
                            size={17}
                            color={colors.mutedForeground}
                        />
                        <TextInput
                            accessibilityLabel={copy.books.searchLabel}
                            testID="book-search"
                            value={search}
                            onChangeText={setSearch}
                            placeholder={copy.books.searchPlaceholder}
                            placeholderTextColor={colors.mutedForeground}
                            style={[
                                styles.searchInput,
                                { color: colors.foreground },
                            ]}
                            returnKeyType="search"
                            autoCorrect={false}
                        />
                        {search.length > 0 && (
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={copy.books.clearSearch}
                                onPress={() => setSearch("")}
                            >
                                <Feather
                                    name="x"
                                    size={18}
                                    color={colors.mutedForeground}
                                />
                            </Pressable>
                        )}
                    </View>
                )}
            </View>
        ),
        [
            colors,
            genre,
            horizontalPadding,
            insets.top,
            isSavedRoute,
            books.length,
            search,
            isRefreshing,
            isLoading,
            refresh,
        ],
    );

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <FlatList
                key={`${columns}-${isSavedRoute}`}
                data={books}
                numColumns={columns}
                stickyHeaderIndices={[0]}
                renderItem={({ item }) => (
                    <BookCard
                        book={item}
                        onOpen={openBook}
                        cardWidth={cardWidth}
                    />
                )}
                keyExtractor={(item) => String(item.id)}
                ListHeaderComponent={listHeader}
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
                        enabled={!isSavedRoute}
                        refreshing={isRefreshing}
                        onRefresh={refresh}
                        tintColor={colors.primary}
                        accessibilityLabel={copy.books.refreshBooks}
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
                                {copy.books.loadingTitle}
                            </Text>
                            <Text
                                style={[
                                    styles.stateText,
                                    { color: colors.mutedForeground },
                                ]}
                            >
                                {copy.books.loadingMessage}
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
                                {copy.books.loadErrorTitle}
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
                                    {copy.books.tryAgain}
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
                                    name={isSavedRoute ? "bookmark" : "search"}
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
                                {isSavedRoute
                                    ? copy.books.savedEmptyTitle
                                    : copy.books.noMatchesTitle}
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
                                    {copy.books.reloadShelf}
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
    header: { width: "100%", marginBottom: 20, zIndex: 2 },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    backButton: {
        width: 82,
        height: 42,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    titleWrap: { flex: 1, alignItems: "center" },
    headerAction: {
        width: 82,
        alignItems: "flex-end",
        justifyContent: "center",
    },
    refreshButton: {
        minHeight: 36,
        paddingHorizontal: 9,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    refreshText: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 12,
        fontWeight: "600",
    },
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
    bookCard: { minWidth: 0, position: "relative" },
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
