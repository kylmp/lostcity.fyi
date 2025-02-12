import { ConfigMapping, IdentifierType } from "../types/identifiers";
import { divideBy1000, mapBooleanValue } from "../utils/parseUtils";

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
  'size': {key: 'details.size'},
  'wanderrange': {key: 'details.wanderrange'},
  'respawnrate': {key: 'details.respawnrate'},
  'maxrange': {key: 'details.maxrange'},
  'huntmode': {key: 'details.huntmode'},
  'huntrange': {key: 'details.huntrange'},
  'damagetype': {key: 'details.damagetype'},
  'hitpoints': {key: 'details.hitpoints'},
  'attack': {key: 'details.attack'},
  'strength': {key: 'details.strength'},
  'defence': {key: 'details.defence'},
  'magic': {key: 'details.magic'},
  'ranged': {key: 'details.ranged'},
  'undead': {key: 'details.undead', value: mapBooleanValue},
  'param.attackrate': {key: 'details.attackrate'},
  'param.attackbonus': {key: 'details.ranged'},
  'param.strengthbonus': {key: 'details.strengthbonus'},
  'param.rangebonus': {key: 'details.rangebonus'},
  'param.magicbonus': {key: 'details.magicbonus'},
  'param.stabdefence': {key: 'details.stabdefence'},
  'param.slashdefence': {key: 'details.slashdefence'},
  'param.crushdefence': {key: 'details.crushdefence'},
  'param.rangedefence': {key: 'details.rangedefence'},
  'param.magicdefence': {key: 'details.magicdefence'},
  'param.combat_xp_multiplier': {key: 'shop.xpMultiplier'},
  'param.ranged': {key: 'details.ranged'},
  'param.owned_shop': {key: 'shop.id'},
  'param.shop_title': {key: 'shop.name'},
}

const shopMappings: ConfigMapping = {
  'param.shop_title': {key: 'name'},
  'param.shop_delta': {key: 'details.delta'},
  'param.shop_buy_multiplier': {key: 'details.buyMultiplier'},
  'param.shop_sell_multiplier': {key: 'details.sellMultiplier'},
  'size': {key: 'details.size'},
}
