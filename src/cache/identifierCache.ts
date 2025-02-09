import { IdentifierType, Identifier, Npc, Obj } from "../types/identifiers";

class IdentifierCache<T extends Identifier> {
  cache: { [id: string]: T };
  type: IdentifierType;

  constructor(type: IdentifierType) {
    this.cache = {};
    this.type = type;
  }

  get = (id: string): T => { 
    return this.cache[id]; 
  }

  put = (id: string, identifier: T): void  => {
    this.cache[id] = identifier 
  };

  delete = (id: string): void => { 
    delete this.cache[id] 
  };

  clear = (): void => { 
    this.cache = {} 
  };
}

var caches: IdentifierCache<any>[] = [];

export const NpcCache = new IdentifierCache<Npc>(IdentifierType.npc);
caches.push(NpcCache);
export const ObjCache = new IdentifierCache<Obj>(IdentifierType.object);
caches.push(ObjCache);

export const clearAll = (): void => caches.forEach(cache => cache.clear());
export const getAll = (): IdentifierCache<any>[] => caches;
export const getByType = (type: IdentifierType) => {
  switch (type) {
    case IdentifierType.npc: return NpcCache;
    case IdentifierType.object: return ObjCache;
  }
}
