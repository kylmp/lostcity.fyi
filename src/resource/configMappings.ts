import { ConfigMapping, IdentifierType } from "../types/identifiers";
import { mapBooleanValue } from "../utils/parseUtils";

export function getConfigMappings(type: IdentifierType): ConfigMapping {
  switch (type) {
    case IdentifierType.object: return objMappings;
    case IdentifierType.shop: return shopMappings;
    case IdentifierType.npc: return npcMappings;
    default: throw new Error(`Config mapping does not exist for type=${IdentifierType[type]}`);
  }
}

const objMappings: ConfigMapping = {
  'name': {key: 'name'},
  'desc': {key: 'details.examineText'},
  'weight': {key: 'details.weight'},
  'cost': {key: 'details.cost'},
  'members': {key: 'details.members', value: mapBooleanValue},
  'tradeable': {key: 'details.tradeable', value: mapBooleanValue},
  'stackable': {key: 'details.stackable', value: mapBooleanValue},
  'respawnrate': {key: 'details.respawnrate'},
  'param.cures_poison': {key: 'details.curesPoison', value: mapBooleanValue},
}

const npcMappings: ConfigMapping = {
  'name': {key: 'name'},
  'desc': {key: 'details.examineText'},
  'members': {key: 'details.members'},
  'param.owned_shop': {key: 'shop.id'},
  'param.shop_title': {key: 'shop.name'},
}

const shopMappings: ConfigMapping = {
  'param.shop_title': {key: 'name'},
  'param.shop_delta': {key: 'details.delta'},
  'param.shop_buy_multiplier': {key: 'details.buyMultiplier'},
  'param.shop_sell_multiplier': {key: 'details.sellMultiplier'},
}
