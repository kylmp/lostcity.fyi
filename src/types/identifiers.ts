export enum IdentifierType {
  object,
  npc
}

export type Identifier = {
  id: string,
  packId: string,
  name: string,
  description: string,
  details: any,
  image?: string
}

export interface Obj extends Identifier {
  stackable: boolean
}

export interface Npc extends Identifier {

}
