const express = require('express');
// for working with directory paths
const path = require('path');
const fs = require('fs');
// database
const dataBase = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const app = express();

function generateUniqueId() {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
  let uniqueId = '';

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueId += characters[randomIndex];
  }

  return uniqueId;
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve files from the public directory
app.use(express.static('public'));


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => 
  res.json(dataBase)
);

// POST request for notes
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = generateUniqueId();
  // Add the new note to the existing data array
  dataBase.push(newNote);

  // Update the db.json file with the new data. Null or undefined specify that no other functions will be applied to the database string. the two allows for indentation and organization of the json for human reading. Later, filter and/or transformation methods could be useful rather than null.
  fs.writeFileSync('./db/db.json', JSON.stringify(dataBase, null, 2));

  // Send a response indicating the note was successfully saved
  res.status(200).json({ message: 'Note saved successfully' });
});

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const noteIndex = dataBase.findIndex((note) => note.id === id);
  if (noteIndex === -1) {
    // Send error response so that promise is still resolved.
    res.status(404).send('Note not found');
    return;
  }
  dataBase.splice(noteIndex, 1);
  fs.writeFileSync('./db/db.json', JSON.stringify(dataBase, null, 2));
  // Send a success response so that the promise is resolved
  res.status(200).send('Note deleted successfully'); 
});

app.listen(PORT, () =>
  console.log(`Note taker app listening at http://localhost:${PORT}`)
);