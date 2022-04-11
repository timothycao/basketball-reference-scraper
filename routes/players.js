const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();

const baseUrl = 'https://www.basketball-reference.com/players';

router.get('/', async (req, res) => {
    const { firstName, lastName, playoffs, season, ...stats } = req.query;

    const url = getUrl(firstName, lastName, baseUrl);

    const html = await getHtml(url);

    const $ = cheerio.load(html);

    const requestedStats = getRequestedStats(stats, $, playoffs, season);

    res.json(requestedStats);
});

function getUrl (firstName, lastName, baseUrl) {
    const firstNameAbbrev = firstName.toLowerCase().slice(0, 2);
    const lastNameAbbrev = lastName.toLowerCase().slice(0, 5);
    const initial = lastName.toLowerCase()[0];

    return `${baseUrl}/${initial}/${lastNameAbbrev}${firstNameAbbrev}01.html`;
}

async function getHtml (url) {
    const response = await axios.get(url);
    
    return response.data;
}

function getTableRow (callback, isPlayoffs, season) {
    const playoffs = isPlayoffs ? '_playoffs' : '';

    return callback(`#div${playoffs}_per_game table tbody tr[id*=${season}]`);
}

function getTableRows (callback, isPlayoffs) {
    const playoffs = isPlayoffs ? '_playoffs' : '';

    return callback(`#div${playoffs}_per_game table tbody tr`);
}

function getTableRowStat (tableRow, stat) {
    return tableRow.find(`[data-stat=${stat}]`).text();
}

function getSeasonStats (statsObject, callback, isPlayoffs, season, givenTableRow) {
    const tableRow = givenTableRow || getTableRow(callback, isPlayoffs, season);
    const seasonStats = { season: getTableRowStat(tableRow, 'season') };

    for (let stat in statsObject) {
        seasonStats[stat] = getTableRowStat(tableRow, stat);
    }

    return seasonStats;
}

function getCareerStats (statsObject, callback, isPlayoffs) {
    const tableRows = getTableRows(callback, isPlayoffs);
    const careerStats = [];

    tableRows.each(function () {
        const tableRow = callback(this);
        if (!tableRow.attr('id')) return;

        const seasonStats = getSeasonStats(statsObject, undefined, undefined, undefined, tableRow);

        careerStats.push(seasonStats);
    })

    return careerStats;
}

function getRequestedStats (statsObject, callback, isPlayoffs, season) {
    if (season) return getSeasonStats(statsObject, callback, isPlayoffs, season);
    else return getCareerStats(statsObject, callback, isPlayoffs);
}

module.exports = router;