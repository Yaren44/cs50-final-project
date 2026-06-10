const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

const scoreXText = document.getElementById("scoreX");
const scoreOText = document.getElementById("scoreO");

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

let scoreX = 0;
let scoreO = 0;

const HUMAN = "🌸";
const AI = "🌙";

const winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

// click
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = cell.dataset.index;

        if (board[index] !== "" || !gameActive) return;

        makeMove(index, HUMAN);
        checkWinner();

        if (gameActive) {
            statusText.textContent = "Current Player: 🌙";
            setTimeout(aiMove, 400);
        }
    });
});

// move
function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
}

// AI (smart)
function aiMove() {

    // 1. kazanabiliyorsa kazan
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = AI;
            if (checkWin(AI)) {
                board[i] = "";
                makeMove(i, AI);
                checkWinner();
                return;
            }
            board[i] = "";
        }
    }

    // 2. oyuncuyu engelle
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = HUMAN;
            if (checkWin(HUMAN)) {
                board[i] = "";
                makeMove(i, AI);
                checkWinner();
                return;
            }
            board[i] = "";
        }
    }

    // 3. center
    if (board[4] === "") {
        makeMove(4, AI);
        checkWinner();
        return;
    }

    // 4. corners
    let corners = [0,2,6,8];
    for (let c of corners) {
        if (board[c] === "") {
            makeMove(c, AI);
            checkWinner();
            return;
        }
    }

    // 5. random
    let empty = [];
    board.forEach((v,i)=>{
        if(v==="") empty.push(i);
    });

    let move = empty[Math.floor(Math.random()*empty.length)];
    makeMove(move, AI);

    checkWinner();
}

// win check
function checkWin(player) {
    for (let cond of winConditions) {
        let [a,b,c] = cond;

        if (
            board[a] === player &&
            board[b] === player &&
            board[c] === player
        ) {
            return true;
        }
    }
    return false;
}

// winner
function checkWinner() {
    for (let cond of winConditions) {
        let [a,b,c] = cond;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            gameActive = false;

            let winner = board[a];

            if (winner === HUMAN) {
                scoreX++;
                scoreXText.textContent = scoreX;
                statusText.textContent = "🌸 Wins!";
            } else {
                scoreO++;
                scoreOText.textContent = scoreO;
                statusText.textContent = "🌙 Wins!";
            }

            return;
        }
    }

    if (!board.includes("")) {
        gameActive = false;
        statusText.textContent = "Draw 🤝";
    }
}

// reset
resetBtn.addEventListener("click", () => {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;

    cells.forEach(c => c.textContent = "");

    statusText.textContent = "Current Player: 🌸";
});
