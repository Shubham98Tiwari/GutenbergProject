export type GutendexPerson = {
    name: string;
    birth_year: number | null;
    death_year: number | null;
};

export type GutendexBook = {
    id: number;
    title: string;
    authors: GutendexPerson[];
    summaries: string[];
    editors: GutendexPerson[];
    translators: GutendexPerson[];
    subjects: string[];
    bookshelves: string[];
    languages: string[];
    copyright: boolean | null;
    media_type: string;
    formats: Record<string, string>;
    download_count: number;
};

export type GutendexResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: GutendexBook[];
};
