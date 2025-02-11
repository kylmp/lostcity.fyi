import { ConfigMapping, Sources, Spawn, Stock } from "../types/identifiers";
import { mapBooleanValue } from "../utils/parseUtils";
import { Identifier } from "./Identifier";

export default class Obj extends Identifier {

  sources: Sources = {
    spawns: [],
    // shops: [],
    // drops: []
  };

  constructor(objPackLine: string) {
    super(objPackLine);
    this.details.certable = false;
  }

  addSpawns(spawns: {[id: string]: Spawn[]}) {
    this.sources.spawns = spawns[this.packId];
  }

  addStock(stock: Stock) {
    this.sources.shops = this.sources.shops || [];
    this.sources.shops.push(stock);
  }
}
