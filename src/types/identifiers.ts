export enum IdentifierType {
  object,
  npc,
  shop
}

export interface ConfigMapping { 
  [configKey: string]: ConfigDetails
}

// If value is not passed, then the first config value will be used
// If array is set to true, then the value will be pushed into the array defined by the key
export type ConfigDetails = {
  key: string, 
  value?: ((values: string[]) => any),
  array?: boolean
}

export type Config = {
  key: string, 
  values: string[]
}

export type Spawn = { 
  coordinates: string, 
  quantity?: string
}

export type Stock = {
  shopId?: string,
  shopName?: string,
  objectId?: string,
  objectName?: string,
  stock: string,
  restockTicks: string,
  basePrice: string,
  soldAt: string,
  boughtAt: string,
}

export type Drop = {

}

export type Sources = {
  spawns?: Spawn[],
  shops?: Stock[],
  drops?: Drop[]
}
