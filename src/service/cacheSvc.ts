import * as identifierCache from "../cache/identifierCache";
import * as searchCache from "../cache/searchCache";
import { IdentifierType } from "../types/identifiers";
import { parseMapAndPack, parseScripts, parseConfig } from "./parseSvc";
import { buildSearchCache } from "./searchSvc";

export var updatedTime: string;

export const rebuild = (): void => {
  updatedTime = new Date().toISOString();
  clearCaches();
  parseFilesAndBuildIdentifierCaches();
  buildSearchCache();
}

function clearCaches(): void {
  identifierCache.clearAll();
  searchCache.clear();
}

function parseFilesAndBuildIdentifierCaches(): void {
  parseMapAndPack();
  parseConfig(IdentifierType.object, 'obj');
  parseConfig(IdentifierType.npc, 'npc');
  parseConfig(IdentifierType.shop, 'inv');
  parseScripts();
}
