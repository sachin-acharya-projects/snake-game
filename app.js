(() => {
  "use strict";

  const canvas = document.querySelector("#snake");
  const context = canvas.getContext("2d");
  const scoreElement = document.querySelector(".scoreboard span");
  const gameOverScreen = document.querySelector(".reloader");
  const finalScoreElement = document.querySelector(".highScore");
  const restartButton = document.querySelector(".reloading");

  const CELL_SIZE = 32;
  const BOARD_SIZE = 608;
  const TICK_RATE = 100;
  const BOUNDS = {
    left: CELL_SIZE,
    right: 17 * CELL_SIZE,
    top: 3 * CELL_SIZE,
    bottom: 17 * CELL_SIZE,
  };

  const images = {
    food: loadImage("img/food.png"),
    ground: loadImage("img/ground.png"),
  };

  const sounds = {
    dead: loadAudio("audio/dead.mp3"),
    eat: loadAudio("audio/eat.mp3"),
    up: loadAudio("audio/up.mp3"),
    right: loadAudio("audio/right.mp3"),
    down: loadAudio("audio/down.mp3"),
    left: loadAudio("audio/left.mp3"),
  };

  const directions = {
    ArrowUp: { x: 0, y: -1, sound: "up", opposite: "ArrowDown" },
    ArrowRight: { x: 1, y: 0, sound: "right", opposite: "ArrowLeft" },
    ArrowDown: { x: 0, y: 1, sound: "down", opposite: "ArrowUp" },
    ArrowLeft: { x: -1, y: 0, sound: "left", opposite: "ArrowRight" },
  };

  let snake;
  let food;
  let direction = null;
  let nextDirection = null;
  let score = 0;
  let gameTimer = null;
  let gameOver = false;

  function loadImage(source) {
    const image = new Image();
    image.src = source;
    return image;
  }

  function loadAudio(source) {
    const audio = new Audio(source);
    audio.preload = "auto";
    return audio;
  }

  function playSound(name) {
    const audio = sounds[name];
    if (!audio) return;

    // Reset short sound effects so they can play again immediately.
    audio.currentTime = 0;
    const playback = audio.play();
    if (playback) playback.catch(() => {
      // Browsers may block audio until the user interacts with the page.
    });
  }

  function randomGridPosition() {
    return {
      x: (Math.floor(Math.random() * 17) + 1) * CELL_SIZE,
      y: (Math.floor(Math.random() * 15) + 3) * CELL_SIZE,
    };
  }

  function positionsMatch(first, second) {
    return first.x === second.x && first.y === second.y;
  }

  function placeFood() {
    let position;

    do {
      position = randomGridPosition();
    } while (snake.some((segment) => positionsMatch(segment, position)));

    return position;
  }

  function resetGame() {
    if (gameTimer !== null) {
      clearInterval(gameTimer);
    }

    snake = [{ x: 9 * CELL_SIZE, y: 10 * CELL_SIZE }];
    direction = null;
    nextDirection = null;
    score = 0;
    gameOver = false;
    food = placeFood();

    scoreElement.textContent = String(score);
    gameOverScreen.classList.remove("open");
    render();
    gameTimer = setInterval(update, TICK_RATE);
  }

  function handleKeydown(event) {
    const requestedDirection = directions[event.key];
    if (!requestedDirection || gameOver) return;

    event.preventDefault();

    const currentDirection = nextDirection || direction;
    if (currentDirection && requestedDirection.opposite === currentDirection) {
      return;
    }

    nextDirection = event.key;
    playSound(requestedDirection.sound);
  }

  function isOutsideBoard(position) {
    return (
      position.x < BOUNDS.left ||
      position.x > BOUNDS.right ||
      position.y < BOUNDS.top ||
      position.y > BOUNDS.bottom
    );
  }

  function endGame() {
    gameOver = true;
    clearInterval(gameTimer);
    gameTimer = null;

    finalScoreElement.textContent = `Score: ${score}`;
    gameOverScreen.classList.add("open");
    playSound("dead");
  }

  function update() {
    if (gameOver) return;

    if (nextDirection) {
      direction = nextDirection;
      nextDirection = null;
    }

    // Wait for the first valid direction before moving.
    if (!direction) {
      render();
      return;
    }

    const movement = directions[direction];
    const head = {
      x: snake[0].x + movement.x * CELL_SIZE,
      y: snake[0].y + movement.y * CELL_SIZE,
    };
    const ateFood = positionsMatch(head, food);

    // The tail moves away on a normal step, so it is not a collision target.
    const bodyToCheck = ateFood ? snake : snake.slice(0, -1);
    if (
      isOutsideBoard(head) ||
      bodyToCheck.some((segment) => positionsMatch(head, segment))
    ) {
      endGame();
      render();
      return;
    }

    snake.unshift(head);

    if (ateFood) {
      score += 1;
      scoreElement.textContent = String(score);
      playSound("eat");
      food = placeFood();
    } else {
      snake.pop();
    }

    render();
  }

  function render() {
    context.fillStyle = "#000";
    context.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    // Keep the original dark header strip at the top of the playfield.
    context.fillStyle = "#030327";
    context.fillRect(0, 0, BOARD_SIZE, 1.6 * CELL_SIZE);

    drawFood();
    drawSnake();
  }

  function drawFood() {
    if (images.food.complete && images.food.naturalWidth > 0) {
      context.drawImage(images.food, food.x, food.y, CELL_SIZE, CELL_SIZE);
      return;
    }

    context.fillStyle = "red";
    context.beginPath();
    context.arc(
      food.x + CELL_SIZE / 2,
      food.y + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2,
    );
    context.fill();
  }

  function drawSnake() {
    snake.forEach((segment, index) => {
      context.fillStyle = index === 0 ? "#22c55e" : "#fff";
      context.fillRect(
        segment.x,
        segment.y,
        CELL_SIZE,
        CELL_SIZE,
      );

      // A small gap makes each segment easier to distinguish.
      context.strokeStyle = "#000";
      context.strokeRect(
        segment.x,
        segment.y,
        CELL_SIZE,
        CELL_SIZE,
      );
    });
  }

  document.addEventListener("keydown", handleKeydown);
  restartButton.addEventListener("click", resetGame);

  resetGame();
})();
