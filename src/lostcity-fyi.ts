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

  res.set('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html><html><body>
    <h3>Lostcity.fyi</h3>
    <p>All data generated from the live game's source code. Website source code <a href="https://github.com/kylmp/lostcity.fyi">here</a>.</p>
    <button type="submit" onclick="location.href='${url}/'">Home</button>
    <input type="text" id="search"><button type="button" onclick="submit()">Search</button><br/><br/>
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
