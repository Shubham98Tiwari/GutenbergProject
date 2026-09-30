import type { GutendexBook, GutendexResponse } from "@/types/gutendex";

const API_URL = "https://gutendex.careers.ignitesol.com/books";

type GetBooksParams = {
    genre: string;
    search?: string;
    signal?: AbortSignal;
};

/**
 * Fetch the first page of books for a genre/search combination.
 *
 * The Ignite assessment API supports:
 * - topic: filter by genre/bookshelf/subject
 * - search: search by title/author
 * - languages: restrict results to English
 * - mime_type: request books with image formats
 */
export async function getBooks({
    genre,
    search,
    signal,
}: GetBooksParams): Promise<GutendexResponse> {
    const params = new URLSearchParams({
        topic: genre,
        languages: "en",
        mime_type: "image/",
    });

    const trimmedSearch = search?.trim();

    if (trimmedSearch) {
        params.set("search", trimmedSearch);
    }

    const response = await fetch(`${API_URL}?${params.toString()}`, {
        signal,
    });

    if (!response.ok) {
        throw new Error(`Gutendex request failed: ${response.status}`);
    }

    return response.json() as Promise<GutendexResponse>;
}

/**
 * Fetch a pagination URL returned by the API.
 *
 * We use the API's `next` URL instead of manually constructing
 * page numbers. This keeps pagination aligned with the API response.
 */
export async function getBooksFromUrl(
    url: string,
    signal?: AbortSignal,
): Promise<GutendexResponse> {
    const response = await fetch(url, {
        signal,
    });

    if (!response.ok) {
        throw new Error(`Gutendex request failed: ${response.status}`);
    }

    return response.json() as Promise<GutendexResponse>;
}

/**
 * Return the first usable cover image from the book formats.
 *
 * The API request already asks for image MIME types, but this
 * defensive check keeps the UI safe if the API ever returns
 * an unexpected format.
 */
export function getCoverUrl(book: GutendexBook): string | null {
    const formats = book.formats;

    return (
        formats["image/jpeg"] ??
        formats["image/png"] ??
        Object.entries(formats).find(([mimeType]) =>
            mimeType.startsWith("image/"),
        )?.[1] ??
        null
    );
}
