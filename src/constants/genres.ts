export const GENRES = [
    "Fiction",
    "Drama",
    "Humor",
    "Politics",
    "Philosophy",
    "History",
    "Adventure",
] as const;

export type Genre = (typeof GENRES)[number];
