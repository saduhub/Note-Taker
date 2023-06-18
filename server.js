const express = require('express');
// for working with directory paths
const path = require('path');
// database
const dataBase = require('./db/db.json');
const PORT = 3001;
const app = express();


// Serve files from the public directory
app.use(express.static('public'));


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/db', (req, res) => 
  res.json(dataBase)
);

app.listen(PORT, () =>
  console.log(`Note taker app listening at http://localhost:${PORT}`)
);