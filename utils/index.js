const axios = require('axios');
const cheerio = require('cheerio');

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

async function getCheerioAPI (firstName, lastName, baseUrl) {
    const url = getUrl(firstName, lastName, baseUrl);
    const html = await getHtml(url);

    return cheerio.load(html);
}

function getTableRow (callback, category, isPlayoffs, season) {
    const playoffs = isPlayoffs ? '_playoffs' : '';

    return callback(`#div${playoffs}_${category} table tbody tr[id*=${season}]`);
}

function getTableRows (callback, category, isPlayoffs) {
    const playoffs = isPlayoffs ? '_playoffs' : '';

    return callback(`#div${playoffs}_${category} table tbody tr`);
}

function getTableRowStat (tableRow, stat) {
    return tableRow.find(`[data-stat=${stat}]`).text();
}

function getSeasonStats (statsObject, callback, category, isPlayoffs, season, givenTableRow) {
    const tableRow = givenTableRow || getTableRow(callback, category, isPlayoffs, season);
    const seasonStats = { season: getTableRowStat(tableRow, 'season') };

    for (let stat in statsObject) {
        seasonStats[stat] = getTableRowStat(tableRow, stat);
    }

    return seasonStats;
}

function getCareerStats (statsObject, callback, category, isPlayoffs) {
    const tableRows = getTableRows(callback, category, isPlayoffs);
    const careerStats = [];

    tableRows.each(function () {
        const tableRow = callback(this);
        if (!tableRow.attr('id')) return;

        const seasonStats = getSeasonStats(statsObject, undefined, undefined, undefined, undefined, tableRow);

        careerStats.push(seasonStats);
    })

    return careerStats;
}

async function getRequestedStats (firstName, lastName, baseUrl, category, isPlayoffs, season, statsObject) {
    const $ = await getCheerioAPI(firstName, lastName, baseUrl);

    if (season) return getSeasonStats(statsObject, $, category, isPlayoffs, season);
    else return getCareerStats(statsObject, $, category, isPlayoffs);
}

module.exports = getRequestedStats;