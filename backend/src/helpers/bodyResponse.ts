interface FullLyric {
   title: string;
   artist: string;
   lyric: string;
}

export function formatApiResponse({
   status,
   message,
   fullLyric = {} as FullLyric,
   errorCode = '',
}: {
   status: number;
   message: string;
   fullLyric?: FullLyric;
   errorCode?: string;
}): {
   status: number;
   message: string;
   timestamp: string;
   fullLyric: FullLyric;
   error_code: string;
} {
   return {
      status,
      message,
      timestamp: new Date().toISOString(),
      fullLyric,
      error_code: errorCode,
   };
}

