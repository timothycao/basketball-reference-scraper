const getRequestedStats = require('../utils');
const express = require('express');
const router = express.Router();

const baseUrl = 'https://www.basketball-reference.com/players';

router.get('/', async (req, res) => {
    const { firstName, lastName, playoffs, season, ...stats } = req.query;

    const requestedStats = await getRequestedStats(firstName, lastName, baseUrl, 'per_game', playoffs, season, stats);

    res.json(requestedStats);
});

module.exports = router;