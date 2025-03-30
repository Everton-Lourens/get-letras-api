import axios from 'axios';
import { logger } from '../helpers/logger.js';

export async function getRawSiteWithLyrics(link: string): Promise<string | null> {
    try {
        const getRawLyric = await axios.get(link);
        return getRawLyric.data;
    } catch (error) {
        logger.error('Erro ao pesquisar letra:', error);
        return null;
    }
}