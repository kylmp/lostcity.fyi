import express from 'express';
import apiRoutes from './routes/apiRoutes';
import adminRoutes from './routes/adminRoutes';
import * as cacheSvc from './service/cacheSvc';
import { search } from './service/searchSvc';
import { IdentifierType } from './types/identifiers';
import { getByType } from './cache/identifierCache';

process.env.PORT = process.env.PORT || '3000'; 
process.env.HOST_URL = process.env.HOST_URL || `http://localhost:${process.env.PORT}`;

const app = express();
const adminApp = express();
cacheSvc.rebuild();

// Temporary "UI"
app.get('/', (req, res) => {
  let results = '';
  const term: string = req.query['term'] as string;
  if (term) {
    const searchResults = search(term);
    results = searchResults.map(result => {
      const params = result.url.substring(result.url.indexOf('?')).split('&');
      return `<a href="${process.env.HOST_URL}/?id=${params[0].substring(8)}&type=${params[1].substring(5)}">${result.name}</a>`;
    }).join('<br/>');
  }

  let item = '';
  const id: string = req.query['id'] as string;
  const type: string = req.query['type'] as string;
  if (id && type) {
    const t = type === 'npc' ? IdentifierType.npc : IdentifierType.object;
    const i = getByType(t).get(id);
    if (i) {
      item = `<pre id="json">${JSON.stringify(i, undefined, 2)}</pre>`
    }
  }
  
  res.set('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html><html><body>
    <h3>Lostcity.fyl</h3><button type="submit" onclick="location.href='${process.env.HOST_URL}/'">Home</button>
    <input type="text" id="search"><button type="button" onclick="submit()">Search</button><br/><br/>
    ${results}${item}
    <script>function submit() {window.location.href = '${process.env.HOST_URL}/?term=' + document.getElementById("search").value;}</script>
    </body></html>
  `);
});

app.use('/api', apiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.HOST_URL}`);
});

adminApp.use('/', adminRoutes);

if (process.env.ADMIN_PORT) {
  adminApp.listen(process.env.ADMIN_PORT, () => {
    console.log(`Admin server is running on ${process.env.ADMIN_HOST_URL || `http://localhost${process.env.ADMIN_PORT}`}`);
  });
}
