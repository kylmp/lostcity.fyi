import { IdentifierCache, ObjCache, ShopCache } from "../cache/identifierCache";
import { Identifier } from "../models/Identifier";
import Shop from "../models/Shop";
import { getConfigMappings } from "../resource/configMappings";
import { IdentifierType, Stock } from "../types/identifiers";
import { parseConfigLine } from "../utils/parseUtils";

export type SpecialConfigContext = {
  key: string, 
  values: string[], 
  cache: IdentifierCache<any>, 
  identifierId: string, 
  identifier: Identifier, 
  identifierLines: string[]
}

export function handleSpecialConfig(context: SpecialConfigContext): boolean {
  const key = (/.+\d+$/.test(context.key)) ? context.key.substring(0, context.key.search(/\d/)) : context.key;
  switch (key) {
    case 'dummyitem': deleteIdentifier(context); return true;
    case 'dummyinv': deleteIdentifier(context); return true;
    case 'param.owned_shop': parseNpcShop(context); return true;
    case 'stock': parseShopStock(context); return true;
    default: return false;
  }
}

function deleteIdentifier(context: SpecialConfigContext) {
  context.cache.delete(context.identifierId);
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
    amount: context.values[1],
    restock: context.values[2],
    basePrice: obj.details.cost, 
    // soldAt: Number(obj.details.cost * shop.details.sellMultiplier),
    // boughtAt: Number(obj.details.cost * shop.details.buyMultiplier),
    // delta: shop.details.delta
  }
  obj.addStock(stock);
  shop.addStock(stock);
}
