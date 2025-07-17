export type Lyric = {
    id: string;
    title: string;
    artist: string;
    author: string;
    lyrics: string;
    path: string
};

export type QueryLyric = {
    text: string;
    title: boolean;
    artist: boolean;
    author: boolean;
    lyrics: boolean;
};