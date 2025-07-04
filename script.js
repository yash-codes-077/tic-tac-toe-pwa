// ✅ SCRIPT.JS — WITH AI DIFFICULTY MODES

let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let turnText = document.querySelector("#turn");
let oScoreDisplay = document.querySelector("#o-score");
let xScoreDisplay = document.querySelector("#x-score");
let themeToggle = document.querySelector("#theme-toggle");
let modeSelect = document.querySelector("#mode");
let difficultySelect = document.querySelector("#difficulty");

let turnO = true;
let count = 0;
let oScore = 0;
let xScore = 0;
let gameMode = "friend";
let difficulty = "hard";

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let moveSound = new Audio("sounds/move.mp3");
let winSound = new Audio("sounds/win.mp3");
let drawSound = new Audio("sounds/draw.mp3");

const playSound = (sound) => {
  sound.pause();
  sound.currentTime = 0;
  sound.play().catch(() => {});
};

const updateTurnText = () => {
  turnText.innerText = `Turn: ${turnO ? "O" : "X"}`;
};

const disableBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });
};

const showWinner = (winner) => {
  setTimeout(() => {
    playSound(winSound);
    msg.innerText = `🎉 Winner is:--> ${winner}`;
    msgContainer.classList.remove("hide");

    if (winner === "O") {
      oScore++;
      oScoreDisplay.innerText = oScore;
    } else {
      xScore++;
      xScoreDisplay.innerText = xScore;
    }
  }, 300);
  disableBoxes();
};

const gameDraw = () => {
  setTimeout(() => {
    playSound(drawSound);
    msg.innerText = "Game was a draw.";
    msgContainer.classList.remove("hide");
  }, 300);
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    if (
      boxes[a].innerText &&
      boxes[a].innerText === boxes[b].innerText &&
      boxes[b].innerText === boxes[c].innerText
    ) {
      showWinner(boxes[a].innerText);
      return true;
    }
  }
  return false;
};

const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  updateTurnText();
};

// ✅ EASY AI = RANDOM MOVE
const randomMove = () => {
  let emptyBoxes = Array.from(boxes).filter((box) => box.innerText === "");
  if (emptyBoxes.length === 0) return;

  const choice = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
  choice.innerText = "X";
  choice.disabled = true;
  playSound(moveSound);
  turnO = true;
  count++;
  updateTurnText();
  const won = checkWinner();
  if (!won && count === 9) gameDraw();
};

// ✅ HARD AI = MINIMAX
const minimax = (board, depth, isMaximizing) => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      board[a].innerText &&
      board[a].innerText === board[b].innerText &&
      board[b].innerText === board[c].innerText
    ) {
      return board[a].innerText === "X" ? 1 : -1;
    }
  }
  if (Array.from(board).every((box) => box.innerText !== "")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i].innerText === "") {
        board[i].innerText = "X";
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i].innerText = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i].innerText === "") {
        board[i].innerText = "O";
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i].innerText = "";
      }
    }
    return best;
  }
};

const aiMove = () => {
  setTimeout(() => {
    if (difficulty === "easy") {
      randomMove();
    } else {
      if (count <= 1) {
        const firstMoves = [0, 2, 4, 6, 8];
        const available = firstMoves.filter(i => boxes[i].innerText === "");
        const choice = available[Math.floor(Math.random() * available.length)];
        boxes[choice].innerText = "X";
        boxes[choice].disabled = true;
        playSound(moveSound);
        turnO = true;
        count++;
        updateTurnText();
        const won = checkWinner();
        if (!won && count === 9) gameDraw();
        return;
      }

      let bestScore = -Infinity;
      let bestMove = null;
      boxes.forEach((box, i) => {
        if (box.innerText === "") {
          box.innerText = "X";
          let score = minimax(boxes, 0, false);
          box.innerText = "";
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      });

      if (bestMove !== null) {
        boxes[bestMove].innerText = "X";
        boxes[bestMove].disabled = true;
        playSound(moveSound);
        turnO = true;
        count++;
        updateTurnText();
        const won = checkWinner();
        if (!won && count === 9) gameDraw();
      }
    }
  }, 1000);
};

// ✅ MAIN CLICK LOGIC
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.innerText !== "") return;

    if (gameMode === "ai") {
      if (turnO) {
        box.innerText = "O";
        box.disabled = true;
        playSound(moveSound);

        turnO = false;
        count++;
        updateTurnText();

        const won = checkWinner();
        if (won || count === 9) {
          if (!won) gameDraw();
          return;
        }
        aiMove();
      }
    } else {
      box.innerText = turnO ? "O" : "X";
      box.disabled = true;
      playSound(moveSound);

      turnO = !turnO;
      count++;
      updateTurnText();

      const won = checkWinner();
      if (!won && count === 9) gameDraw();
    }
  });
});

resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
});

modeSelect.addEventListener("change", (e) => {
  gameMode = e.target.value;
  resetGame();
});

difficultySelect.addEventListener("change", (e) => {
  difficulty = e.target.value;
  resetGame();
});

updateTurnText();