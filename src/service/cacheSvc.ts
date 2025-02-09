import * as identifierCache from "../cache/identifierCache";
import * as searchCache from "../cache/searchCache";
import { parseMap, parseNpc, parseObj, parsePack, parseScripts } from "./parseSvc";

export const rebuild = (): void => {
  clearCaches();
  parseFilesAndBuildIdentifierCaches();
  buildSearchCache();
}

function clearCaches(): void {
  identifierCache.clearAll();
  searchCache.clear();
}

function parseFilesAndBuildIdentifierCaches(): void {
  parsePack();
  parseMap();
  parseNpc();
  parseObj();
  parseScripts();
}

function buildSearchCache(): void {
  identifierCache.getAll().forEach(iden => {
    Object.keys(iden.cache).forEach(key => {
      const { id, name } = iden.get(key);
      searchCache.put(iden.type, id, name);
    });
  });
}
