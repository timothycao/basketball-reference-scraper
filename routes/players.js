const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();

const baseUrl = 'https://www.basketball-reference.com/players';

router.get('/', async (req, res) => {
    const { firstName, lastName, playoffs, ...stats } = req.query;

    const firstNameAbbrev = firstName.toLowerCase().slice(0, 2);
    const lastNameAbbrev = lastName.toLowerCase().slice(0, 5);
    const initial = lastName.toLowerCase()[0];

    const response = await axios.get(`${baseUrl}/${initial}/${lastNameAbbrev}${firstNameAbbrev}01.html`);
    const html = response.data;

    const $ = cheerio.load(html);
    const tableRows = playoffs ? $('#div_playoffs_per_game table tbody tr') : $('#div_per_game table tbody tr');
    
    const seasons = [];

    tableRows.each(function () {
        const tableRow = $(this);

        if (!tableRow.attr('id')) return;

        const seasonStats = { season: tableRow.attr('id').slice(-4) };
        const otherStats = [ 'age', 'team_id', 'lg_id', 'pos', 'g', 'gs', 'fg_pct', 'fg3_pct', 'fg2_pct', 'efg_pct', 'ft_pct' ]; // not per game stats
        
        for (let stat in stats) {
            if (otherStats.includes(stat)) {
                seasonStats[stat] = tableRow.find(`[data-stat=${stat}]`).text();
            } else {
                seasonStats[stat] = tableRow.find(`[data-stat=${stat}_per_g]`).text();
            }
        }

        seasons.push(seasonStats);
    });

    res.json(seasons);
});

module.exports = router;