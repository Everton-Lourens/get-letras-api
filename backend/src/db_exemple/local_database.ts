//APENAS UM EXEMPLO DE BANCO DE DADOS LOCAL EM JSON CRIADO POR CHATGPT
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Obtém o caminho do arquivo atual
const __filename = fileURLToPath(import.meta.url);

// Obtém o diretório do arquivo atual
const __dirname = dirname(__filename);
const path = resolve(__dirname, '../../local_db/database.json');
const path_exemple_json = resolve(__dirname, '../../local_db/body.json');
var redis_cache: any = null;
var redis_cache_body_exemple: any = null;

redis_cache = readDatabase();
redis_cache_body_exemple = readDatabase_exemple();

// Função para ler o banco de dados
function readDatabase() {
  try {
    if (redis_cache === null) {
      const data = fs.readFileSync(path, 'utf8');
      redis_cache = JSON.parse(data);
      return JSON.parse(data);
    } else {
      return redis_cache;
    }
  } catch (error) {
    console.error('Erro ao ler o banco de dados:', error);
    return {};
  }
}

export function readDatabase_exemple() {
  try {
    if (redis_cache_body_exemple === null) {
      const data = fs.readFileSync(path_exemple_json, 'utf8');
      redis_cache_body_exemple = JSON.parse(data);
      return JSON.parse(data);
    } else {
      return redis_cache_body_exemple;
    }
  } catch (error) {
    console.error('Erro ao ler o banco de dados:', error);
    return {};
  }
}

// Função para escrever no banco de dados
function writeDatabase(data: any) {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
    console.log('Banco de dados atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao escrever no banco de dados:', error);
  }
}

// Função para obter um estágio específico
export function getMessageDatabase(stage: any) {
  const db = readDatabase();
  return db.database[stage] || null;
}

export function getAllItemsDatabase(get_items: any) {
  const db = readDatabase();
  return db.database[get_items] || null;
}

// Função para atualizar um estágio
function updateStage(stage: any, messages: any) {
  const db = readDatabase();
  db.database[stage] = messages;
  writeDatabase(db);
}