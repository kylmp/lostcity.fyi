import express from 'express';
import * as cacheSvc from '../service/cacheSvc';

const adminRoutes = express.Router();

adminRoutes.get('/', (req, res) => {
  const url = `${req.protocol}://${req.get('host')}`;
  res.set('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html><html><head></head><body>
    <h3>Lostcity.fyl Admin</h3>
    <p>Cache last built: ${cacheSvc.updatedTime}</p>
    <button type="submit" onclick="location.href='${url}/rebuild?redirect=true'">Rebuild Cache</button>
    </body></html>
  `);
});

adminRoutes.get('/rebuild', (req, res) => {
  const msg = 'Rebuilding the cache now';
  cacheSvc.rebuild();
  if (req.query['redirect'] as string === 'true') {
    res.redirect('/');
  } else {
    res.status(200).send(msg);
  }
});

export default adminRoutes;
