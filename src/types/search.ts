import { IdentifierType } from "./identifiers";

export type SearchData = {
  type: IdentifierType, 
  idName: string, 
  friendlyName: string
};

export type SearchResult = {
  name: string,
  url: string
}
