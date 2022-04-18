const players = require('./routes/players');
const express = require('express');
const path = require('path');

const app = express()

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/players', players);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));