import { readFileSync } from "fs";
import * as identifierCache from "../cache/identifierCache";
import { Config, ConfigDetails, IdentifierType, Spawn } from "../types/identifiers";
import { getLines } from "../utils/stringUtils";
import { getFilesWithExtension } from "../utils/fileUtils";
import Obj from "../models/Obj";
import Npc from "../models/Npc";
import Shop from "../models/Shop";
import { getIdentifierLines, parseConfigLine } from "../utils/parseUtils";
import { Identifier } from "../models/Identifier";
import { handleSpecialConfig } from "./specialConfigSvc";
import { getConfigMappings } from "../resource/configMappings";

export function parseMapAndPack(): void {
  const { npcSpawns, objSpawns } = parseMap();
  const packDefinitions = [
    {type: IdentifierType.npc, path: `/pack/npc.pack`},
    {type: IdentifierType.object, path: `/pack/obj.pack`},
    {type: IdentifierType.shop, path: `/pack/inv.pack`}
  ];
  for (const packDefinition of packDefinitions) {
    const cache = identifierCache.getByType(packDefinition.type);
    const lines = getLines(readFileSync(`${process.env.SRC_DIR}${packDefinition.path}`, 'utf8'));
    for (const line of lines) {
      switch (packDefinition.type) {
        case IdentifierType.npc: {
          let npc = new Npc(line);
          npc.addSpawns(npcSpawns);
          cache.put(npc.id, npc);
          break;
        }
        case IdentifierType.object: {
          let obj = new Obj(line);
          if (!obj.id) continue;
          if (obj.id.startsWith('cert_')) {
            obj = cache.get(obj.id.substring(5));
            obj.details.certable = true;
          }
          obj.addSpawns(objSpawns);
          cache.put(obj.id, obj);
          break;
        }
        case IdentifierType.shop: {
          let shop = new Shop(line);
          cache.put(shop.id, shop);
          break;
        }
      }
    }
  }
}

function parseMap(): {npcSpawns: {[id: string]: Spawn[]}, objSpawns: {[id: string]: Spawn[]}} {
  const npcSpawns: {[id: string]: Spawn[]} = {};
  const objSpawns: {[id: string]: Spawn[]} = {};
  const files = getFilesWithExtension(process.env.SRC_DIR, 'jm2');
  files.forEach(file => {
    const lines: string[] = getLines(readFileSync(file, "utf8"));
    let state: string = '';
    for (const line of lines) {
      if (line === '') state = '';
      else if (line === '==== NPC ====') state = 'npc';
      else if (line === '==== OBJ ====') state = 'obj';
      else {
        if (state === '') continue;
        const split = line.split(': ');
        if (split.length !== 2) continue;
        const coords = split[0].split(' ');
        const fileName = file.split('\\').pop()!!.split('/').pop();
        const coordinates = `${coords[0]}_${fileName?.substring(1, fileName.indexOf('.'))}_${coords[1]}_${coords[2]}`;
        if (state === 'npc') {
          npcSpawns[split[1]] = npcSpawns[split[1]] || [];
          npcSpawns[split[1]].push({coordinates: coordinates});
        }
        else if (state === 'obj') {
          const objSplit = split[1].split(' ');
          objSpawns[objSplit[0]] = objSpawns[objSplit[0]] || [];
          objSpawns[objSplit[0]].push({coordinates: coordinates, quantity: objSplit[1]});
        }
      }
    }
  });
  return {npcSpawns: npcSpawns, objSpawns: objSpawns};
}

export function parseConfig(type: IdentifierType, fileExt: string): void {
  const files = getFilesWithExtension(process.env.SRC_DIR, fileExt);
  const cache: identifierCache.IdentifierCache<any> = identifierCache.getByType(type);
  if (!cache) return;
  for (const file of files) {
    const fileLines: string[] = getLines(readFileSync(file, "utf8"));
    const identifierLinesMap: {[identifierId: string]: string[]} = getIdentifierLines(fileLines);
    for (const identifierId of Object.keys(identifierLinesMap)) {
      const identifier: Identifier | undefined = cache.get(identifierId);
      const identifierLines: string[] = identifierLinesMap[identifierId];
      if (!identifier) continue;
      for (const line of identifierLines) {
        const config: Config | undefined = parseConfigLine(line);
        if (!config) continue;
        if (handleSpecialConfig({key: config.key, values: config.values, cache: cache, 
          identifierId: identifierId, identifier: identifier, identifierLines: identifierLines})) continue;
        const details: ConfigDetails = getConfigMappings(type)[config.key];
        if (!details) continue;
        identifier.addConfig(details, config.values);
      }
    }
  }
}

export function parseScripts(): void {
// todo
}
