import { IdentifierType } from "../types/identifiers";

export type CategoryItem = { 
  id: string, 
  type: IdentifierType 
}

interface CategoryCache {
  [category: string]: CategoryItem[]
}

const categoryCache: CategoryCache = {};

export function put(category: string, id: string, type: IdentifierType): void {
  categoryCache[category] = categoryCache[category] || [];
  categoryCache[category].push({id: id, type: type});
}

export function get(category: string): CategoryItem[] {
  return categoryCache[category];
}
