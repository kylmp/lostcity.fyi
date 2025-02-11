import { Stock } from "../types/identifiers";
import { Identifier } from "./Identifier";

export default class Shop extends Identifier {

  stock: Stock[] = [];

  constructor(objPackLine: string) {
    super(objPackLine);
  }

  addStock(stock: Stock) {
    this.stock.push(stock);
  }
}