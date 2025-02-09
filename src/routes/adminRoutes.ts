import express from 'express';
import * as cacheSvc from '../service/cacheSvc';

const adminRoutes = express.Router();

adminRoutes.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html><html><head></head><body>
    <h3>Lostcity.fyl Admin</h3>
    <button type="submit" onclick="location.href='${process.env.ADMIN_HOST_URL}/rebuild'">Rebuild Cache</button>
    </body></html>
  `);
});

adminRoutes.get('/rebuild', (req, res) => {
  cacheSvc.rebuild();
  res.redirect('/');
});

export default adminRoutes;
