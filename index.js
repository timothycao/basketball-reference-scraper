const players = require('./routes/players');
const express = require('express');
const app = express()

app.use('/players', players);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));