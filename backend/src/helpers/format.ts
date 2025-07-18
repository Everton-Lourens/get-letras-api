export function formatLyric(text: string) {
    // Convert visible \n to real line breaks
    const lines = text.replace(/\\n/g, '\n')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean); // remove empty strings

    const blocks = [];
    for (let i = 0; i < lines.length; i += 2) {
        // If there are 3 lines left at the end, group all
        if (i + 3 === lines.length) {
            blocks.push([lines[i], lines[i + 1], lines[i + 2]]);
            break;
        }
        blocks.push([lines[i], lines[i + 1]]);
    }

    // Join blocks with \n\n between them
    return blocks.map(b => b.join('\n')).join('\n\n');
}

export function simpleFormatLyrics(lyrics: string): string {
    // Remover tags HTML
    // Substituir <br> por \n
    lyrics = lyrics.replace(/<br\s*\/?>/gi, '\n');

    // Substituir <p> por \n\n
    lyrics = lyrics.replace(/<\/?p[^>]*>/gi, '\n');

    // Remover tags restantes
    lyrics = lyrics.replace(/<\/?[^>]+(>|$)/g, '');

    lyrics = lyrics.trim();
    return lyrics;
}

