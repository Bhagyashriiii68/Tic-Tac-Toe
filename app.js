let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

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
    msgContainer.classList.add("hide");
};

// Player's move logic (O)
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) { // Only allow the player to play if it's their turn
            box.innerText = "O";
            box.disabled = true;
            turnO = false;

            // Check for win or tie after the player's move
            checkWinner();

            if (!turnO) { // Computer's turn after the player
                setTimeout(computerMove, 500); // Slight delay for better user experience
            }
        }
    });
});

// Computer's move logic (X)
const computerMove = () => {
    let availableBoxes = [];

    // Get available (empty) boxes
    boxes.forEach((box, index) => {
        if (box.innerText === "") {
            availableBoxes.push(index);
        }
    });

    // If there are available boxes, randomly pick one for the computer's move
    if (availableBoxes.length > 0) {
        let randomIndex = Math.floor(Math.random() * availableBoxes.length);
        let box = boxes[availableBoxes[randomIndex]];
        box.innerText = "X";
        box.disabled = true;
        turnO = true; // Player's turn next

        // Check for win or tie after the computer's move
        checkWinner();
    }
};

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
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const showTie = () => {
    msg.innerText = "It's a Tie!";
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const checkWinner = () => {
    let isTie = true;

    // Check for winning patterns
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                boxes[pattern[0]].classList.add("winning-line");
                boxes[pattern[1]].classList.add("winning-line");
                boxes[pattern[2]].classList.add("winning-line");
                showWinner(pos1Val);
                return; // Exit if we find a winner
            }
        }
    }

    // Check for tie (if all boxes are filled and no winner)
    boxes.forEach((box) => {
        if (box.innerText === "") {
            isTie = false; // If there's an empty box, it's not a tie
        }
    });

    if (isTie) {
        showTie();
        disableBoxes();
    }
};

// Reset and new game buttons
newGameBtn.addEventListener("click", resetGame);
resetbtn.addEventListener("click", resetGame);
