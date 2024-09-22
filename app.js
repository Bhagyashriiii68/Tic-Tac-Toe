let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let board1d = [0,0,0,0,0,0,0,0,0];
let turnO = true; // true if it's player O's turn, false if it's player X's (computer)
const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const resetGame = () => {
    turnO = true; // player O starts
    enableBoxes();
    board1d =  [0,0,0,0,0,0,0,0,0];
    boxes.forEach((box) => {
        box.classList.remove("winning-line");
    })
    msgContainer.classList.add("hide");
};


// Player's move logic (O)
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (turnO) { // Only allow the player to play if it's their turn
            box.innerText = "O";
            box.disabled = true;
            turnO = false;
            board1d[index] = 1;
            result_out();

            if (!turnO) {
                setTimeout(computerMove, 200); // Slight delay for better user experience
            }
        }
    });
});
function max(a, b){
    if (a > b) return a;
    return b;
}
function min(a, b) {
    if (a < b) return a;
    return b;
}


// Mini-Max algorithm for finding the score
const minimax = (mnx_board, depth, is_maximize) => {
    let winner = checkWinner(false);
    if(winner === 2){
        return Infinity
    }
    if(winner === 1){
        return -Infinity
    }
    if(is_tie()){
        return 0
    }
    if(is_maximize){
        let best_score = -1000
        for(let i = 0; i <= board1d.length; i++){
            if(board1d[i] === 0){
                board1d[i] = 2;
                let score = minimax(board1d, depth + 1, false);
                board1d[i] = 0;
                best_score = max(score, best_score);
            }
        }
        return best_score;
    }
    else{
        let best_score = 1000
        for(let i = 0; i <= board1d.length; i++){
            if(board1d[i] === 0){
                board1d[i] = 1;
                let score = minimax(board1d, depth + 1, true);
                board1d[i] = 0;
                best_score = min(score, best_score);
            }
        }
        return best_score;
    }
}
const computerMove = () => {
    let best_score = -1000;
    let move = -1;
    for(let i = 0; i < board1d.length; i++) {
        if (board1d[i] === 0){
            board1d[i] = 2;
            let score = minimax(board1d, 0, false);
            board1d[i] = 0;
            // console.log("Temp score :",score, "for :", i);
            if(score > best_score){
                best_score = score;
                move = i;
            }
        }
    }
    // console.log("Final best score :", best_score, "for :", move);
    if(move !== -1){
        let box = boxes[move];
        box.innerText = "X";
        box.disabled = true;
        turnO = true;
        board1d[move] = 2;
        result_out();
    }

};
function result_out() {
    let tmp = checkWinner();
    if (tmp) {
        showWinner(tmp);
    } else {
        if (is_tie()) {
            showTie();
        }
    }
}

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

const showWinner = (winner) => {
    if(winner === 2){
        winner = 'X'
    }
    else{
        winner = 'O'
    }
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const showTie = () => {
    msg.innerText = "It's a Tie!";
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const checkWinner = (show = true) => {

    // Check for winning patterns
    for (let pattern of winPatterns) {
        let pos1Val = board1d[pattern[0]];
        let pos2Val = board1d[pattern[1]];
        let pos3Val = board1d[pattern[2]];

        if (pos1Val !== 0 && pos2Val !== 0 && pos3Val !== 0  ) {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                if(show){
                    boxes[pattern[0]].classList.add("winning-line");
                    boxes[pattern[1]].classList.add("winning-line");
                    boxes[pattern[2]].classList.add("winning-line");
                }
                return pos1Val; // Exit if we find a winner
            }
        }
    }
    return 0;

};
function is_tie(){
    let isTie = true;
    for(let i = 0; i < board1d.length; i++){
        if(board1d[i] === 0){
            isTie = false;
        }
    }
    return isTie;
}

// Reset and new game buttons
newGameBtn.addEventListener("click", resetGame);
resetbtn.addEventListener("click", resetGame);
