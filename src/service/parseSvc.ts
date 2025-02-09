import { readFileSync } from "fs";
import * as identifierCache from "../cache/identifierCache";
import { IdentifierType } from "../types/identifiers";
import { getLines } from "../utils/stringUtils";

export function parsePack(): void {
  const packDefinitions = [
    {type: IdentifierType.npc, path: `/pack/npc.pack`},
    {type: IdentifierType.object, path: `/pack/obj.pack`}
  ];
  for (const packDefinition of packDefinitions) {
    const cache = identifierCache.getByType(packDefinition.type);
    getLines(readFileSync(`${process.env.SRC_DIR}${packDefinition.path}`, 'utf8')).forEach(line => {
      const split = line.split('=');
      if (split.length === 2) {
        let idName = split[1];
        let iden = <any>{id: split[1], packId: split[0]};
        if (packDefinition.type === IdentifierType.object) {
          if (split[1].startsWith('cert_')) {
            idName = split[1].substring(5);
            iden = cache.get(idName);
            iden.stackable = true;
          } else {
            iden.stackable = false;
          }
        }
        cache.put(idName, iden);
      }
    });
  }
}

export function parseMap(): void {

}

export function parseNpc(): void {

}

export function parseObj(): void {

}

export function parseScripts(): void {

}