import 'dotenv/config';
import express from 'express';
import apiRoutes from './routes/apiRoutes';
import adminRoutes from './routes/adminRoutes';
import * as cacheSvc from './service/cacheSvc';
import { search } from './service/searchSvc';
import { IdentifierType } from './types/identifiers';
import { getByType } from './cache/identifierCache';

process.env.PORT = process.env.PORT || '3000'; 

const app = express();
app.set('trust proxy', '127.0.0.1');
const adminApp = express();
adminApp.set('trust proxy', '127.0.0.1');
cacheSvc.rebuild();

// Temporary "UI"
const cssDark = `body { font-family: arial, sans-serif; color: #cccccc; background-color: #111111 }button {  background-color: #333333;  border: 1px solid transparent;  border-radius: .65rem;  box-sizing: border-box;  color: #FFFFFF;  cursor: pointer;  flex: 0 0 auto;  font-family: arial, sans-serif;  font-size: .9rem;  font-weight: 250;  line-height: 1rem;  padding: .5rem .8rem;  text-align: center;  text-decoration: none #6B7280 solid;  text-decoration-thickness: auto;  transition-duration: .2s;  transition-property: background-color,border-color,color,fill,stroke;  transition-timing-function: cubic-bezier(.4, 0, 0.2, 1);  user-select: none;  -webkit-user-select: none;  touch-action: manipulation;  width: auto;}button:hover {  background-color: #374151;}button:focus {  box-shadow: none;  outline: 2px solid transparent;  outline-offset: 2px;}@media (min-width: 768px) {  button {    padding: .5rem 1rem;  }}a {color: rgb(143, 188, 143);}input {border: 1px solid transparent;  border-radius: .65rem;  box-sizing: border-box;  color: #333333;  cursor: pointer;  flex: 0 0 auto;  font-family: arial, sans-serif;  font-size: .9rem;  font-weight: 250;  line-height: 1rem;  padding: .5rem .8rem; margin-right: 5px;}`;
app.get('/', (req, res) => {
  const url = `${req.protocol}://${req.get('host')}`;
  let results = '';
  const term: string = req.query['term'] as string;
  if (term) {
    const searchResults = search(term);
    results = searchResults.map(result => {
      return `<a href="${url}/?id=${result.id}&type=${result.type}">${result.name} (${result.type})</a>`;
    }).join('<br/>');
  }

  let item = '';
  const id: string = req.query['id'] as string;
  const type: string = req.query['type'] as string;
  if (id && type) {
    const identifier = getByType(IdentifierType[type as keyof typeof IdentifierType]).get(id);
    item = identifier ? `<pre id="json">${JSON.stringify(identifier, undefined, 2)}</pre>` : item;
  }

  const val = term ? `value="${term}"` : '';
  res.set('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html><html><head><link rel="icon" type="image/png" href="${url}/img/avatar.png"/><style>${cssDark}</style></head><body>
    <h3>Lostcity.fyi</h3>
    <p>All data generated from the live game's source code. Website source code <a href="https://github.com/kylmp/lostcity.fyi">here</a>.</p>
    <p>Work in progress, if you want to build a UI for this contact @Kylmp on discord</p>
    <input type="text" id="search" placeholder="object, shop, npc" ${val}><button type="button" onclick="submit()">Search</button><br/><br/>
    ${results}${item}
    <script>function submit() {window.location.href = '${url}/?term=' + document.getElementById("search").value;}</script>
    </body></html>
  `);
});

app.use('/api', apiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});

adminApp.use('/', adminRoutes);

if (process.env.ADMIN_PORT) {
  adminApp.listen(process.env.ADMIN_PORT, () => {
    console.log(`Admin server is running on ${process.env.ADMIN_PORT}`);
  });
}

process.on('SIGTERM', () => {
  console.log('SIGTERM - Shutting down');
  process.exit();
});
process.on('SIGINT', () => {
  console.log('SIGINT - Shutting down');
  process.exit();
});
