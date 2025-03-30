interface FullLyric {
   id: string;
   title: string;
   artist: string;
   author: string;
   lyrics: string;
}

export function formatApiResponse({
   fullLyric = {} as FullLyric,
}: {
   fullLyric?: FullLyric;
}): {
   fullLyric: FullLyric;
} {
   return {
      fullLyric: {
         id: fullLyric.id,
         title: fullLyric.title,
         artist: fullLyric.artist,
         author: fullLyric.author,
         lyrics: fullLyric.lyrics,
      },
   };
}

