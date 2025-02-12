import express from 'express';
import { search } from '../service/searchSvc';
import { NpcCache, ObjCache } from '../cache/identifierCache';
import { IdentifierType } from '../types/identifiers';
import { calculateShopItemPrice } from '../utils/calculator';

const apiRoutes = express.Router();

apiRoutes.get('/search', (req, res) => {
  res.send(search(req.query['term'] as string));
});

apiRoutes.get('/identifier', (req, res) => {
  const idName: string = req.query['idName'] as string;
  const type: IdentifierType = IdentifierType[req.query['type'] as string as keyof typeof IdentifierType];
  switch(type) {
    case IdentifierType.npc: {
      const npc = NpcCache.get(idName);
      npc ? res.send(npc) : res.sendStatus(404);
      break;
    }
    case IdentifierType.object: {
      const obj = ObjCache.get(idName);
      obj ? res.send(obj) : res.sendStatus(404);
      break;
    }
    default: res.status(400).send('Invalid type');
  }
});

apiRoutes.get('/calculate-price', (req, res) => {
  const shopId = req.query['shopId'] as string;
  const objId = req.query['objId'] as string;
  const stock = Number(req.query['stock']);
  if (!shopId || !objId || isNaN(stock)) {
    res.status(400).send('Missing or invalid required param; Required query params = [shopId: string, objId: string, stock: number]');
  } else {
    const prices = calculateShopItemPrice(shopId, objId, stock);
    if (!prices) {
      res.status(404).send('Shop or item not found');
    } else {
      res.send(prices);
    }
  }
});

export default apiRoutes;
