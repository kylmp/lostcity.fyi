import { Sources, Spawn } from "../types/identifiers";
import { Identifier } from "./Identifier";

export default class Npc extends Identifier {
  sources: Sources = {
    spawns: []
  };

  constructor(objPackLine: string) {
    super(objPackLine);
    // Default values
    this.details.attackrate = '4';
    this.details.xpMultiplier = 1;
  }

  addSpawns(spawns: {[id: string]: Spawn[]}) {
    this.sources.spawns = spawns[this.packId];
  }
}
