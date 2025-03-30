import axios from "axios";
import { logger } from "../helpers/logger.js";

export async function searchOnMultipleEngines(query: string): Promise<string | null> {
    const searchEngines = [
        { name: "AOL", baseUrl: "https://search.aol.com/aol/search", queryParam: "q" },
        { name: "Bing", baseUrl: "https://www.bing.com/search", queryParam: "q" },
        { name: "Yahoo", baseUrl: "https://search.yahoo.com/search", queryParam: "p" },
        { name: "Brave", baseUrl: "https://search.brave.com/search", queryParam: "q" },
        { name: "Google", baseUrl: "https://www.google.com/search", queryParam: "q" },
        //{ name: "Yandex", baseUrl: "https://yandex.com/search/", queryParam: "text" },
        //{ name: "Ecosia", baseUrl: "https://www.ecosia.org/search", queryParam: "q" },
        //{ name: "StartPage", baseUrl: "https://www.startpage.com/sp/search", queryParam: "query" },
        //{ name: "MetaGer", baseUrl: "https://metager.org/meta/meta.ger3", queryParam: "eingabe" },
        //{ name: "DuckDuckGo", baseUrl: "https://duckduckgo.com/", queryParam: "q" },
    ];

    const encodedQuery = encodeURIComponent(query);

    for (const engine of searchEngines) {
        const url = `${engine.baseUrl}?${engine.queryParam}=${encodedQuery}`;
        logger.info(`Tentando no ${engine.name}: ${url}`);

        try {
            logger.info(`11111111111`);
            const response = await axios.get(url, { timeout: 10000 });
            logger.info(`222222222222`);
            const html = response.data;
            logger.info(`33333333333`);
            const match = html.match(/https:\/\/www\.letras\.mus\.br\/[^'"\s&]+/);
            logger.info(`44444444444`);
            if (match && match[0]) {
                /*
                    const link = decodeURIComponent(match[0]);
                    return link;
                */
                const link = decodeURIComponent(match[0]);

                if (link) {
                    logger.info(`Link encontrado no ${engine.name}: ${link}`);
                    return link;
                }
            }

        } catch (error: any) {
            if (error.response && error.response.status === 429) {
                console.warn(`Erro 429 no ${engine.name}. Pulando para o próximo...`);
            } else {
                logger.error(`Erro ao tentar no ${engine.name}: ${error.message}`);
            }
        }
        await sleep(500);
    }

    // Função para adicionar atrasos entre requisições
    async function sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    logger.info("Nenhum link encontrado em nenhum motor de busca.");
    return null;
}