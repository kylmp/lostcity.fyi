import { ConfigMapping, Sources, Spawn } from "../types/identifiers";
import { Identifier } from "./Identifier";

export default class Npc extends Identifier {
  sources: Sources = {
    spawns: []
  };

  constructor(objPackLine: string) {
    super(objPackLine);
  }

  addSpawns(spawns: {[id: string]: Spawn[]}) {
    this.sources.spawns = spawns[this.packId];
  }
}
