import { GutendexBook } from "@/services/gutendex";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const STORAGE_KEY = "gutenberg-saved-books";

interface SavedBooksContextValue {
    savedBooks: GutendexBook[];
    isSaved: (id: number) => boolean;
    toggleSaved: (book: GutendexBook) => void;
}

const SavedBooksContext = createContext<SavedBooksContextValue | null>(null);

export function SavedBooksProvider({ children }: { children: ReactNode }) {
    const [savedBooks, setSavedBooks] = useState<GutendexBook[]>([]);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY)
            .then((value) => {
                if (value) setSavedBooks(JSON.parse(value) as GutendexBook[]);
            })
            .catch(() => undefined);
    }, []);

    const toggleSaved = (book: GutendexBook) => {
        setSavedBooks((current) => {
            const next = current.some((item) => item.id === book.id)
                ? current.filter((item) => item.id !== book.id)
                : [...current, book];
            void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    const value = useMemo(
        () => ({
            savedBooks,
            isSaved: (id: number) => savedBooks.some((book) => book.id === id),
            toggleSaved,
        }),
        [savedBooks],
    );

    return (
        <SavedBooksContext.Provider value={value}>
            {children}
        </SavedBooksContext.Provider>
    );
}

export function useSavedBooks() {
    const context = useContext(SavedBooksContext);
    if (!context)
        throw new Error("useSavedBooks must be used within SavedBooksProvider");
    return context;
}
