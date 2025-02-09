import { searchCache } from "../cache/searchCache";
import { IdentifierType } from "../types/identifiers";
import { SearchResult } from "../types/search";

export const search = (searchTerm: string): SearchResult[] => {
  const term = searchTerm.toLowerCase();
  const results = searchCache.filter(data => {
    return data.idName.toLowerCase().indexOf(term) >= 0
  });
  return results.map(data => <SearchResult>{name: data.idName, url: `${process.env.HOST_URL}/api/identifier?idName=${data.idName}&type=${IdentifierType[data.type]}`});
}
