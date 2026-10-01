/**
 * English UI copy in one place so another locale can be added without
 * searching screen components for user-facing strings.
 */
const copy = {
    home: {
        title: "Gutenberg\nProject",
        description:
            "A social cataloging website that allows you to freely search its database of books, annotations, and reviews.",
        sectionKicker: "Browse by mood",
        sectionTitle: "Find your next read",
        quote: "“A reader lives a thousand lives before he dies.”",
        quoteAuthor: "— George R. R. Martin",
        savedBooks: "Open saved books",
        genres: {
            fiction: "Fiction",
            drama: "Drama",
            humour: "Humour",
            politics: "Politics",
            philosophy: "Philosophy",
            history: "History",
            adventure: "Adventure",
        },
        browseGenre: (genre: string) => `Browse ${genre}`,
    },
    books: {
        defaultGenre: "Fiction",
        shelfSubtitle: "Project Gutenberg shelf",
        searchPlaceholder: "Search title or author",
        openBook: (title: string) => `Open ${title}`,
        saveBook: (title: string) => `Save ${title}`,
        removeSavedBook: (title: string) => `Remove ${title} from saved books`,
        unknownAuthor: "Unknown author",
        noViewableTitle: "No viewable version available",
        noViewableMessage:
            "This book does not include an HTML, PDF, or TXT edition.",
        openFailureTitle: "Could not open book",
        openFailureMessage:
            "The selected edition could not be opened on this device.",
        initialLoadError:
            "We could not load this shelf. Check your connection and try again.",
        moreBooksError: "More books could not be loaded right now.",
        loadingTitle: "Opening the shelf…",
        loadingMessage: "Finding books with covers for you.",
        loadErrorTitle: "Nothing loaded yet",
        tryAgain: "Try again",
        savedEmptyTitle: "Your shelf is waiting",
        savedEmptyMessage:
            "Save books while browsing and they will appear here for quick access.",
        noMatchesTitle: "No matches",
        noGenreBooks: "No books are available in this genre yet.",
        noSearchResults: (search: string) =>
            `No books found for “${search}”. Try another title or author.`,
        savedCount: (count: number) =>
            `${count} saved ${count === 1 ? "book" : "books"}`,
        back: "Go back",
        clearSearch: "Clear search",
        searchLabel: "Search books",
        reloadShelf: "Reload shelf",
        refreshBooks: "Refresh books",
        refreshingBooks: "Refreshing books…",
    },
    system: {
        oopsTitle: "Oops!",
        errorDetails: "View error details",
        closeErrorDetails: "Close error details",
        errorTitle: "Something went wrong",
        reloadMessage: "Please reload the app to continue.",
        tryAgain: "Try Again",
        errorDetailsTitle: "Error Details",
        errorPrefix: "Error:",
        stackTraceLabel: "Stack Trace:",
        notFoundTitle: "This screen doesn’t exist.",
        homeLink: "Go to home screen!",
    },
} as const;

export default copy;
