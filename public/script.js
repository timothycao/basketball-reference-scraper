const baseUrl = window.location.href + 'players/?';

const statsRef = {
    'general': [
        { value: 'age', text: 'Age' },
        { value: 'team_id', text: 'Tm' },
        { value: 'lg_id', text: 'Lg' },
        { value: 'pos', text: 'Pos' },
        { value: 'g', text: 'G' }
    ],
    'per_game': [
        { value: 'gs', text: 'GS' },
        { value: 'mp_per_g', text: 'MP' },
        { value: 'fg_per_g', text: 'FG' },
        { value: 'fga_per_g', text: 'FGA' },
        { value: 'fg_pct', text: 'FG%' },
        { value: 'fg3_per_g', text: '3P' },
        { value: 'fg3a_per_g', text: '3PA' },
        { value: 'fg3_pct', text: '3P%' },
        { value: 'fg2_per_g', text: '2P' },
        { value: 'fg2a_per_g', text: '2PA' },
        { value: 'fg2_pct', text: '2P%' },
        { value: 'efg_pct', text: 'eFG%' },
        { value: 'ft_per_g', text: 'FT' },
        { value: 'fta_per_g', text: 'FTA' },
        { value: 'ft_pct', text: 'FT%' },
        { value: 'orb_per_g', text: 'ORB' },
        { value: 'drb_per_g', text: 'DRB' },
        { value: 'trb_per_g', text: 'TRB' },
        { value: 'ast_per_g', text: 'AST' },
        { value: 'stl_per_g', text: 'STL' },
        { value: 'blk_per_g', text: 'BLK' },
        { value: 'tov_per_g', text: 'TOV' },
        { value: 'pf_per_g', text: 'PF' },
        { value: 'pts_per_g', text: 'PTS' }
    ],
    'advanced': [
        { value: 'mp', text: 'MP' },
        { value: 'per', text: 'PER' },
        { value: 'ts_pct', text: 'TS%' },
        { value: 'fg3a_per_fga_pct', text: '3PAr' },
        { value: 'fta_per_fga_pct', text: 'FTr' },
        { value: 'orb_pct', text: 'ORB%' },
        { value: 'drb_pct', text: 'DRB%' },
        { value: 'trb_pct', text: 'TRB%' },
        { value: 'ast_pct', text: 'AST%' },
        { value: 'stl_pct', text: 'STL%' },
        { value: 'blk_pct', text: 'BLK%' },
        { value: 'tov_pct', text: 'TOV%' },
        { value: 'usg_pct', text: 'USG%' },
        { value: 'ows', text: 'OWS' },
        { value: 'dws', text: 'DWS' },
        { value: 'ws', text: 'WS' },
        { value: 'ws_per_48', text: 'WS/48' },
        { value: 'obpm', text: 'OBPM' },
        { value: 'dbpm', text: 'DBPM' },
        { value: 'bpm', text: 'BPM' },
        { value: 'vorp', text: 'VORP' }
    ]
};

function load () {
    loadRequestUrl();
    loadStats();
}

function loadRequestUrl () {
    document.getElementById('requestUrl').innerHTML = baseUrl;
}

function loadStats () {
    for (let category in statsRef) {
        statsRef[category].forEach((statRef) => addCheckbox(category, statRef.value, statRef.text))
    }
}

function addCheckbox (id, value, text) {
    const element = document.getElementById(id);
    element.innerHTML += `<div class="checkbox"><input id=${value} class="form" type="checkbox">${text}</div>`;
}

function toggleStats (category) {
    document.getElementById('general').style.display = 'flex';
    document.getElementById(category).style.display = 'flex';

    const otherCategory = category === 'per_game' ? 'advanced' : 'per_game';
    document.getElementById(otherCategory).style.display = 'none';

    const otherCategoryStats = document.getElementById(otherCategory).children;
    for (let i = 0; i < otherCategoryStats.length; i++) {
        otherCategoryStats[i].firstChild.checked = false;
    }
}

function createQueryParam (id) {
    const element = document.getElementById(id);

    if (id === 'firstName') return element.value ? `${id}=${element.value}` : '';
    if (element.type === 'text') return element.value ? `&${id}=${element.value}` : '';
    if (element.type === 'checkbox') return element.checked ? `&${id}=${element.checked}` : '';
    if (element.type === 'select-one') return element.options[category.selectedIndex].value ? `&${id}=${element.options[category.selectedIndex].value}` : '';
}

function updateRequestUrl () {
    const requestUrl = document.getElementById('requestUrl');
    requestUrl.innerHTML = baseUrl;

    const formElements = document.querySelectorAll('.form');

    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        requestUrl.innerHTML += createQueryParam(element.id);
    }
}