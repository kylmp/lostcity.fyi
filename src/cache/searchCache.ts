import { IdentifierType } from "../types/identifiers";
import { SearchData } from "../types/search";

export var searchCache: SearchData[] = [];

export const put = (type: IdentifierType, idName: string, friendlyName: string) => {
  searchCache.push({type, idName, friendlyName});
}

export const clear = (): void => {
  searchCache = [];
}
