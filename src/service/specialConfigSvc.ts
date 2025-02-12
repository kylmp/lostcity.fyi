import * as categoryCache from "../cache/categoryCache";
import { IdentifierCache, ObjCache, ShopCache } from "../cache/identifierCache";
import { Identifier } from "../models/Identifier";
import Shop from "../models/Shop";
import { getConfigMappings } from "../resource/configMappings";
import { ConfigDetails, IdentifierType, Stock } from "../types/identifiers";
import { parseConfigLine } from "../utils/parseUtils";

export type SpecialConfigContext = {
  key: string, 
  values: string[], 
  cache: IdentifierCache<any>, 
  type: IdentifierType,
  identifierId: string, 
  identifier: Identifier, 
  identifierLines: string[]
}

export function handleSpecialConfig(context: SpecialConfigContext): boolean {
  const key = (/.+\d+$/.test(context.key)) ? context.key.substring(0, context.key.search(/\d/)) : context.key;
  switch (key) {
    case 'desc': parseDesc(context); return true;
    case 'dummyitem': deleteIdentifier(context); return true;
    case 'dummyinv': deleteIdentifier(context); return true;
    case 'category': handleCategory(context); return true;
    case 'param.owned_shop': parseNpcShop(context); return true;
    case 'stock': parseShopStock(context); return true;
    default: return false;
  }
}

function parseDesc(context: SpecialConfigContext) {
  const configDetails: ConfigDetails = getConfigMappings(context.type)[context.key];
  if (configDetails) {
    context.identifier.addConfig(configDetails, [ context.values.join(',') ]);
  }
}

function deleteIdentifier(context: SpecialConfigContext) {
  context.cache.delete(context.identifierId);
}

function handleCategory(context: SpecialConfigContext) {
  categoryCache.put(context.values[0], context.identifierId, context.type);
  context.identifier.addCategory(context.values[0]);
}

function parseNpcShop(context: SpecialConfigContext) {
  // Add shopId to the NPC
  const npcShopConfigDetails = getConfigMappings(IdentifierType.npc)[context.key];
  if (npcShopConfigDetails) {
    context.identifier.addConfig(npcShopConfigDetails, context.values);
  }

  // Add shop params to the shop
  const shop = ShopCache.get(context.values[0]);
  const shopMappings = getConfigMappings(IdentifierType.shop);
  for (const line of context.identifierLines) {
    if (line.startsWith('param=shop_')) {
      const config = parseConfigLine(line);
      if (!config) continue;
      const shopConfigDetails = shopMappings[config.key];
      if (shopConfigDetails) {
        shop.addConfig(shopConfigDetails, config.values);
      }
    }
  }
}

function parseShopStock(context: SpecialConfigContext) {
  const shop = <Shop>context.identifier;
  const obj = ObjCache.get(context.values[0]);
  if (!obj) return;
  const stock: Stock = {
    shopId: context.identifierId,
    shopName: shop.name,
    objectId: context.values[0], 
    objectName: obj.name, 
    stock: context.values[1],
    restockTicks: context.values[2],
    basePrice: obj.details.cost, 
    soldAt: String(Math.floor(obj.details.cost * shop.details.sellMultiplier / 1000)),
    boughtAt: String(Math.floor(obj.details.cost * shop.details.buyMultiplier / 1000)),
  }
  obj.addStock(stock);
  shop.addStock(stock);
}
