import { ConfigDetails } from "../types/identifiers";

export class Identifier {
  id: string;
  packId: string;
  name: string = '';
  details: any = {};
  categories?: string[];

  constructor(packLine: string) {
    this.parsePackLine(packLine);
  }

  parsePackLine = (line: string): void => {
    const split = line.split('=');
    if (split.length !== 2) {
      this.id = '';
      this.packId = '';
    } else {
      this.id = split[1];
      this.packId = split[0];
    }
  }

  addCategory = (category: string): void => {
    this.categories = this.categories || [];
    this.categories.push(category);
  }

  addConfig = (config: ConfigDetails, values: string[]): void => {
    let pos: any = this;
    const value: any = (!config.value) ? values[0] : config.value(values);
    const keySplit = config.key.split('.');
    for (let i = 0; i < keySplit.length; i++) {
      const key: string = keySplit[i];
      if (i === keySplit.length - 1) {
        const array = config.array || false;
        if (array) {
          pos[key] = pos[key] || [];
          pos[key].push(value) 
        } else {
          pos[key] = value;
        }
      } else {
        pos[key] = pos[key] || {};
      }
      pos = pos[key];
    }
  }
}