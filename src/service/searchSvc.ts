import * as identifierCache from "../cache/identifierCache";
import * as searchCache from "../cache/searchCache";
import { IdentifierType } from "../types/identifiers";
import { SearchData } from "../types/search";

export const search = (searchTerm: string): SearchData[] => {
  const term = searchTerm.toLowerCase();
  return searchCache.getAll().filter(data => data.name.toLowerCase().indexOf(term) >= 0);
}

export function buildSearchCache(): void {
  identifierCache.getAll().forEach(iden => {
    Object.keys(iden.cache).forEach(key => {
      const { id, name } = iden.get(key);
      searchCache.put(IdentifierType[iden.type], id, name);
    });
  });
}
