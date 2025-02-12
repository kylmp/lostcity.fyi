import { ShopCache } from "../cache/identifierCache";

export function calculateShopItemPrice(shopId: string, objId: string, stockCount: number): {soldAt: number, boughtAt: number} | null {
  const shop = ShopCache.get(shopId);
  if (shop) {
    const shopItemDatas = shop.stock.filter(st => st.objectId === objId);
    if (shopItemDatas.length !== 1) return null;
    const adjustedDelta = Math.min(1000, (Math.max(-5000, (stockCount - Number(shopItemDatas[0].stock)) * shop.details.delta)));
    return {
      soldAt: Math.floor(Math.max(100, (shop.details.sellMultiplier - adjustedDelta)) * Number(shopItemDatas[0].basePrice) / 1000),
      boughtAt: Math.floor(Math.max(100, (shop.details.buyMultiplier - adjustedDelta)) * Number(shopItemDatas[0].basePrice) / 1000)
    };
  }
  return null;
}
