const { getUrl, getHtml, getRequestedStats } = require('../utils');
const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();

const baseUrl = 'https://www.basketball-reference.com/players';

router.get('/', async (req, res) => {
    const { firstName, lastName, playoffs, season, ...stats } = req.query;

    const url = getUrl(firstName, lastName, baseUrl);

    const html = await getHtml(url);

    const $ = cheerio.load(html);

    const requestedStats = getRequestedStats(stats, $, 'per_game', playoffs, season);

    res.json(requestedStats);
});

module.exports = router;