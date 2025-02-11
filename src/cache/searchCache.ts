import { IdentifierType } from "../types/identifiers";
import { SearchData } from "../types/search";

var searchCache: SearchData[] = [];

export const put = (type: string, id: string, name: string) => {
  searchCache.push({type, id, name});
}

export const clear = (): void => {
  searchCache = [];
}

export const getAll = (): SearchData[] => {
  return searchCache;
}
