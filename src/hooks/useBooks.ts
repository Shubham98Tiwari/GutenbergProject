import { useCallback, useEffect, useRef, useState } from "react";

import { getBooks, getBooksFromUrl, getCoverUrl } from "@/services/gutendex";
import type { GutendexBook } from "@/types/gutendex";

const SEARCH_DEBOUNCE_MS = 350;

type UseBooksResult = {
    books: GutendexBook[];
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
    hasNextPage: boolean;
    search: string;
    setSearch: (value: string) => void;
    loadMore: () => void;
    retry: () => void;
};

function booksWithCovers(books: GutendexBook[]): GutendexBook[] {
    return books.filter((book) => getCoverUrl(book) !== null);
}

function mergeUniqueBooks(
    current: GutendexBook[],
    incoming: GutendexBook[],
): GutendexBook[] {
    const booksById = new Map<number, GutendexBook>();

    for (const book of current) {
        booksById.set(book.id, book);
    }

    for (const book of incoming) {
        booksById.set(book.id, book);
    }

    return Array.from(booksById.values());
}

export function useBooks(genre: string): UseBooksResult {
    const [books, setBooks] = useState<GutendexBook[]>([]);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [nextUrl, setNextUrl] = useState<string | null>(null);

    /**
     * Used to force the initial request again when retry() is called.
     */
    const [retryCount, setRetryCount] = useState(0);

    /**
     * Every new genre/search request gets a new request ID.
     *
     * This prevents an older network request from updating the UI
     * after the user has already changed the search or genre.
     */
    const requestIdRef = useRef(0);

    /**
     * Prevent multiple onEndReached calls from starting
     * simultaneous pagination requests.
     */
    const isFetchingMoreRef = useRef(false);

    /**
     * Keep track of the active pagination request so it can be
     * cancelled when the user starts a new search/genre request.
     */
    const paginationControllerRef = useRef<AbortController | null>(null);

    /**
     * Debounce search input.
     *
     * This prevents an API request for every individual keystroke.
     */
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, SEARCH_DEBOUNCE_MS);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [search]);

    /**
     * Initial request.
     *
     * This runs whenever:
     * - genre changes
     * - debounced search changes
     * - retry() is called
     */
    useEffect(() => {
        const controller = new AbortController();

        /**
         * Cancel an older pagination request because its results
         * no longer belong to the current screen state.
         */
        paginationControllerRef.current?.abort();
        paginationControllerRef.current = null;

        const requestId = ++requestIdRef.current;

        isFetchingMoreRef.current = false;

        setBooks([]);
        setNextUrl(null);
        setError(null);
        setIsLoading(true);
        setIsLoadingMore(false);

        getBooks({
            genre,
            search: debouncedSearch,
            signal: controller.signal,
        })
            .then((response) => {
                if (controller.signal.aborted) {
                    return;
                }

                if (requestId !== requestIdRef.current) {
                    return;
                }

                const books = booksWithCovers(response.results);

                setBooks(books);
                setNextUrl(response.next);
                setError(null);
            })
            .catch((requestError: unknown) => {
                if (controller.signal.aborted) {
                    return;
                }

                if (requestId !== requestIdRef.current) {
                    return;
                }

                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "Unable to load books.",
                );
            })
            .finally(() => {
                if (controller.signal.aborted) {
                    return;
                }

                if (requestId !== requestIdRef.current) {
                    return;
                }

                setIsLoading(false);
            });

        return () => {
            controller.abort();
        };
    }, [genre, debouncedSearch, retryCount]);

    /**
     * Load the next page using the exact `next` URL returned
     * by the Ignite API.
     */
    const loadMore = useCallback(() => {
        if (
            isLoading ||
            isLoadingMore ||
            !nextUrl ||
            isFetchingMoreRef.current
        ) {
            return;
        }

        const requestId = requestIdRef.current;
        const controller = new AbortController();

        paginationControllerRef.current?.abort();
        paginationControllerRef.current = controller;

        isFetchingMoreRef.current = true;
        setIsLoadingMore(true);

        getBooksFromUrl(nextUrl, controller.signal)
            .then((response) => {
                if (controller.signal.aborted) {
                    return;
                }

                if (requestId !== requestIdRef.current) {
                    return;
                }

                const incomingBooks = booksWithCovers(response.results);

                setBooks((currentBooks) =>
                    mergeUniqueBooks(currentBooks, incomingBooks),
                );

                setNextUrl(response.next);
                setError(null);
            })
            .catch((requestError: unknown) => {
                if (controller.signal.aborted) {
                    return;
                }

                if (requestId !== requestIdRef.current) {
                    return;
                }

                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "Unable to load more books.",
                );
            })
            .finally(() => {
                if (paginationControllerRef.current === controller) {
                    paginationControllerRef.current = null;
                }

                isFetchingMoreRef.current = false;

                if (
                    !controller.signal.aborted &&
                    requestId === requestIdRef.current
                ) {
                    setIsLoadingMore(false);
                }
            });
    }, [isLoading, isLoadingMore, nextUrl]);

    /**
     * Retry the current request.
     */
    const retry = useCallback(() => {
        setRetryCount((current) => current + 1);
    }, []);

    return {
        books,
        isLoading,
        isLoadingMore,
        error,
        hasNextPage: nextUrl !== null,
        search,
        setSearch,
        loadMore,
        retry,
    };
}
