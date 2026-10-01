export interface GutendexBook {
    id: number;
    title: string;
    authors: Array<{
        name: string;
        birth_year: number | null;
        death_year: number | null;
    }>;
    subjects: string[];
    bookshelves: string[];
    languages: string[];
    download_count: number;
    formats: Record<string, string>;
}

export interface GutendexResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: GutendexBook[];
}

const API_BASE = "https://gutendex.careers.ignitesol.com/books";

export function getCoverUrl(book: GutendexBook) {
    const cover = Object.entries(book.formats).find(
        ([mime, url]) => mime.startsWith("image/") && !url.endsWith(".zip"),
    );
    return cover?.[1] ?? null;
}

export function getPreferredReadUrl(book: GutendexBook) {
    const entries = Object.entries(book.formats).filter(
        ([mime, url]) =>
            !url.toLowerCase().endsWith(".zip") && !mime.includes("zip"),
    );
    const find = (predicate: (mime: string) => boolean) =>
        entries.find(([mime]) => predicate(mime))?.[1] ?? null;

    return (
        find((mime) => mime.startsWith("text/html")) ??
        find((mime) => mime.includes("pdf")) ??
        find((mime) => mime.startsWith("text/plain")) ??
        null
    );
}

export function buildBooksUrl(topic: string, search: string) {
    const params = new URLSearchParams();
    params.set("mime_type", "image/");
    if (topic && topic !== "all") params.set("topic", topic);
    if (search.trim()) params.set("search", search.trim());
    return `${API_BASE}?${params.toString()}`;
}

export function resolveNextUrl(nextUrl: string) {
    try {
        const next = new URL(nextUrl);
        return `${API_BASE}?${next.searchParams.toString()}`;
    } catch {
        return nextUrl;
    }
}

export async function fetchBooks(url: string, signal?: AbortSignal) {
    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error(`Gutendex request failed with ${response.status}`);
    }
    return (await response.json()) as GutendexResponse;
}
