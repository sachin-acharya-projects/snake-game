(() => {
  "use strict";

  const gameCanvas = document.querySelector("#game-board");
  const canvasContext = gameCanvas.getContext("2d");
  const scoreValue = document.querySelector(".score-value");
  const gameOverOverlay = document.querySelector(".game-over");
  const finalScoreValue = document.querySelector(".game-over__score");
  const restartButton = document.querySelector(".game-over__restart");

  const CELL_SIZE = 32;
  const BOARD_SIZE = 608;
  const GAME_TICK_MS = 100;

  const BOARD_BOUNDS = {
    left: CELL_SIZE,
    right: 17 * CELL_SIZE,
    top: 3 * CELL_SIZE,
    bottom: 17 * CELL_SIZE,
  };

  const foodImage = loadImage("img/food.png");

  const soundEffects = {
    gameOver: loadAudio("audio/dead.mp3"),
    eat: loadAudio("audio/eat.mp3"),
    up: loadAudio("audio/up.mp3"),
    right: loadAudio("audio/right.mp3"),
    down: loadAudio("audio/down.mp3"),
    left: loadAudio("audio/left.mp3"),
  };

  const MOVEMENT_DIRECTIONS = {
    ArrowUp: { x: 0, y: -1, sound: "up", opposite: "ArrowDown" },
    ArrowRight: { x: 1, y: 0, sound: "right", opposite: "ArrowLeft" },
    ArrowDown: { x: 0, y: 1, sound: "down", opposite: "ArrowUp" },
    ArrowLeft: { x: -1, y: 0, sound: "left", opposite: "ArrowRight" },
  };

  let snakeSegments = [];
  let foodPosition = null;
  let currentDirection = null;
  let queuedDirection = null;
  let score = 0;
  let gameIntervalId = null;
  let isGameOver = false;

  function loadImage(sourcePath) {
    const image = new Image();
    image.src = sourcePath;
    return image;
  }

  function loadAudio(sourcePath) {
    const audio = new Audio(sourcePath);
    audio.preload = "auto";
    return audio;
  }

  function playSoundEffect(effectName) {
    const audio = soundEffects[effectName];
    if (!audio) return;

    audio.currentTime = 0;
    const playback = audio.play();

    if (playback) {
      playback.catch(() => {
        // Audio may be blocked until the player interacts with the page.
      });
    }
  }

  function getRandomBoardPosition() {
    return {
      x: (Math.floor(Math.random() * 17) + 1) * CELL_SIZE,
      y: (Math.floor(Math.random() * 15) + 3) * CELL_SIZE,
    };
  }

  function arePositionsEqual(firstPosition, secondPosition) {
    return (
      firstPosition.x === secondPosition.x &&
      firstPosition.y === secondPosition.y
    );
  }

  function generateFoodPosition() {
    let candidatePosition;

    do {
      candidatePosition = getRandomBoardPosition();
    } while (
      snakeSegments.some((segment) =>
        arePositionsEqual(segment, candidatePosition),
      )
    );

    return candidatePosition;
  }

  function startNewGame() {
    if (gameIntervalId !== null) {
      clearInterval(gameIntervalId);
    }

    snakeSegments = [{ x: 9 * CELL_SIZE, y: 10 * CELL_SIZE }];
    foodPosition = null;
    currentDirection = null;
    queuedDirection = null;
    score = 0;
    isGameOver = false;
    foodPosition = generateFoodPosition();

    scoreValue.textContent = String(score);
    gameOverOverlay.classList.remove("is-visible");
    renderGame();

    gameIntervalId = setInterval(updateGame, GAME_TICK_MS);
  }

  function handleDirectionInput(event) {
    const requestedDirection = MOVEMENT_DIRECTIONS[event.key];
    if (!requestedDirection || isGameOver) return;

    event.preventDefault();

    const activeDirection = queuedDirection || currentDirection;
    if (
      activeDirection &&
      requestedDirection.opposite === activeDirection
    ) {
      return;
    }

    queuedDirection = event.key;
    playSoundEffect(requestedDirection.sound);
  }

  function isOutsideBoard(position) {
    return (
      position.x < BOARD_BOUNDS.left ||
      position.x > BOARD_BOUNDS.right ||
      position.y < BOARD_BOUNDS.top ||
      position.y > BOARD_BOUNDS.bottom
    );
  }

  function finishGame() {
    isGameOver = true;
    clearInterval(gameIntervalId);
    gameIntervalId = null;

    finalScoreValue.textContent = `Final score: ${score}`;
    gameOverOverlay.classList.add("is-visible");
    playSoundEffect("gameOver");
  }

  function updateGame() {
    if (isGameOver) return;

    if (queuedDirection) {
      currentDirection = queuedDirection;
      queuedDirection = null;
    }

    // Keep the snake still until the player chooses an initial direction.
    if (!currentDirection) {
      renderGame();
      return;
    }

    const movement = MOVEMENT_DIRECTIONS[currentDirection];
    const nextHeadPosition = {
      x: snakeSegments[0].x + movement.x * CELL_SIZE,
      y: snakeSegments[0].y + movement.y * CELL_SIZE,
    };
    const willEatFood = arePositionsEqual(nextHeadPosition, foodPosition);

    // On a normal move the tail vacates its cell, so exclude it from collision checks.
    const collisionSegments = willEatFood
      ? snakeSegments
      : snakeSegments.slice(0, -1);

    const hitsSnake = collisionSegments.some((segment) =>
      arePositionsEqual(nextHeadPosition, segment),
    );

    if (isOutsideBoard(nextHeadPosition) || hitsSnake) {
      finishGame();
      renderGame();
      return;
    }

    snakeSegments.unshift(nextHeadPosition);

    if (willEatFood) {
      score += 1;
      scoreValue.textContent = String(score);
      playSoundEffect("eat");
      foodPosition = generateFoodPosition();
    } else {
      snakeSegments.pop();
    }

    renderGame();
  }

  function renderGame() {
    canvasContext.fillStyle = "#000";
    canvasContext.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    canvasContext.fillStyle = "#030327";
    canvasContext.fillRect(0, 0, BOARD_SIZE, 1.6 * CELL_SIZE);

    drawFood();
    drawSnake();
  }

  function drawFood() {
    if (foodImage.complete && foodImage.naturalWidth > 0) {
      canvasContext.drawImage(
        foodImage,
        foodPosition.x,
        foodPosition.y,
        CELL_SIZE,
        CELL_SIZE,
      );
      return;
    }

    canvasContext.fillStyle = "#ef4444";
    canvasContext.beginPath();
    canvasContext.arc(
      foodPosition.x + CELL_SIZE / 2,
      foodPosition.y + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2,
    );
    canvasContext.fill();
  }

  function drawSnake() {
    snakeSegments.forEach((segment, index) => {
      canvasContext.fillStyle = index === 0 ? "#22c55e" : "#fff";
      canvasContext.fillRect(
        segment.x,
        segment.y,
        CELL_SIZE,
        CELL_SIZE,
      );

    });
  }

  document.addEventListener("keydown", handleDirectionInput);
  restartButton.addEventListener("click", startNewGame);

  startNewGame();
})();
