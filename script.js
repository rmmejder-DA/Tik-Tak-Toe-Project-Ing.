let field = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

let lastMoveIdx = null;
let winLine = null;


function updatePlayerNamesDisplay() {
    setName('name-x', playerNames.x, 'Kreuz', 'x');
    setName('name-o', playerNames.o, 'Kreis', 'o');
}

function setName(id, name, def, symbol) {
    const el = document.getElementById(id);
    if (!el) return;
    if (name && name !== def) {
        el.textContent = name + ' (' + symbol + ')';
        el.classList.remove('hidden');
    } else {
        el.classList.add('hidden');
    }
}

let winner = null;
let playerNames = {
    x: 'Kreuz',
    o: 'Kreis'
};

function saveNames() {
    setNameValue('playerX', 'x', 'Kreuz');
    setNameValue('playerO', 'o', 'Kreis');
    showGameArea();
    // Felder und Button deaktivieren, wenn Spiel startet
    const xInput = document.getElementById('playerX');
    const oInput = document.getElementById('playerO');
    const saveBtn = document.querySelector('button[onclick="saveNames()"]');
    const resetArea = document.getElementById('reset-area');
    if (playerNames.x !== 'Kreuz' && playerNames.o !== 'Kreis') {
        xInput.disabled = true;
        oInput.disabled = true;
        if (saveBtn) saveBtn.disabled = true;
        if (resetArea) resetArea.style.display = '';
    }
}

function setNameValue(inputId, key, def) {
    const inp = document.getElementById(inputId);
    const val = inp.value.trim();
    if (val) playerNames[key] = val;
    inp.value = '';
}

function showGameArea() {
    const area = document.getElementById('game-area');
    const ready = playerNames.x !== 'Kreuz' && playerNames.o !== 'Kreis';
    area.style.display = ready ? '' : 'none';
    if (ready) render();
}

function resetGame() {
    for (let i = 0; i < field.length; i++) {
        field[i] = null;
    }
    currentPlayer = cross;
    winner = null;
    playerNames.x = 'Kreuz';
    playerNames.o = 'Kreis';
    // Spielfeld und Reset-Button ausblenden
    const gameArea = document.getElementById('game-area');
    if (gameArea) gameArea.style.display = 'none';
    const resetArea = document.getElementById('reset-area');
    if (resetArea) resetArea.style.display = 'none';
    // Felder und Button wieder aktivieren
    const xInput = document.getElementById('playerX');
    const oInput = document.getElementById('playerO');
    const saveBtn = document.querySelector('button[onclick="saveNames()"]');
    if (xInput) xInput.disabled = false;
    if (oInput) oInput.disabled = false;
    if (saveBtn) saveBtn.disabled = false;
    render();
    updatePlayerNamesDisplay();
}

// Werte für das Spielfeld
const cross = 'x';
const circle = 'o';

function init() {
    render();
}

let currentPlayer = cross;

function render() {
    updatePlayerNamesDisplay();
    document.getElementById('content').innerHTML = renderStatus() + renderTable();
}

function renderTable() {
    let html = '<div class="winlinesize">';
    html += '<table class="tic-tac-toe" style="position:relative;z-index:1;">';
    for (let r = 0; r < 3; r++) {
        html += '<tr>';
        for (let c = 0; c < 3; c++) html += renderCell(r * 3 + c, lastMoveIdx);
        html += '</tr>';
    }
    html += '</table>';
    if (winLine) html += renderWinLine(winLine);
    html += '</div>';
    return html;
}

function renderCell(idx, lastIdx) {
    let cell = '';
    let animate = idx === lastIdx && !winLine ? ' animate' : '';
    if (field[idx] === cross)
        cell = `<svg class="svg-cross${animate}" width="60" height="60" viewBox="0 0 60 60"><line x1="12" y1="12" x2="48" y2="48"/><line x1="48" y1="12" x2="12" y2="48"/></svg>`;
    else if (field[idx] === circle)
        cell = `<svg class="svg-circle${animate}" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="18"/></svg>`;
    if (!winner && field[idx] === null)
        return `<td onclick="handleClick(${idx})">${cell}</td>`;
    return `<td>${cell}</td>`;
}
function renderWinLine(line) {
    const pos = i => [i % 3, Math.floor(i / 3)];
    const [a, , c] = line;
    const [x1, y1] = pos(a);
    const [x2, y2] = pos(c);
    const scale = 120, offset = 60;
    return `<svg class="win-line"><line x1="${x1 * scale + offset}" y1="${y1 * scale + offset}" x2="${x2 * scale + offset}" y2="${y2 * scale + offset}" stroke="#facc15" stroke-width="8" stroke-linecap="round"/></svg>`;
}

function renderStatus() {
    if (!winner) return '';
    playApplause();
    const name = winner === cross ? playerNames.x : playerNames.o;
    return `<div class='status winner-animate'><b>Gewinner: ${name} (${winner})</b></div>`;
}

function playApplause() {
    const audio = document.getElementById('applause-audio');
    if (audio) {
        audio.currentTime = 0;
        audio.play();
        audio.onended = function () {
            // resetGame();
        };
    }
}

function handleClick(idx) {
    if (field[idx] !== null || winner) return;
    field[idx] = currentPlayer;
    lastMoveIdx = idx;
    let res = checkWinner();
    winner = res ? res.winner : null;
    winLine = res ? res.line : null;
    if (!winner) currentPlayer = currentPlayer === cross ? circle : cross;
    render();
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];
    for (const p of winPatterns) {
        const [a, b, c] = p;
        if (field[a] && field[a] === field[b] && field[a] === field[c])
            return { winner: field[a], line: p };
    }
    return null;
}

