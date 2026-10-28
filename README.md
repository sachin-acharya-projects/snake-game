# Snake Game

A classic Snake game built with **HTML, CSS, and vanilla JavaScript**. Move the snake around the board, eat food to grow, and try to get the highest score before hitting a wall or yourself.

## Features

- Classic grid-based Snake gameplay rendered with the HTML Canvas API
- Keyboard controls with prevention of immediate 180-degree turns
- Score counter that increases whenever food is eaten
- Sound effects for movement, eating, and game over
- Game-over screen with your score and a reload button
- No frameworks, package manager, or build step required

## Getting Started

### Play locally

1. Clone the repository:

   ```bash
   git clone https://github.com/sachin-acharya-projects/snake-game.git
   cd snake-game
   ```

2. Open `index.html` in your web browser.

That is it—there are no dependencies to install.

### Run with a local server (optional)

You can also serve the project with any static file server. For example, if Python is installed:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## How to Play

| Key | Action |
| --- | --- |
| <kbd>↑</kbd> / <kbd>W</kbd>* | Move up |
| <kbd>↓</kbd> / <kbd>S</kbd>* | Move down |
| <kbd>←</kbd> / <kbd>A</kbd>* | Move left |
| <kbd>→</kbd> / <kbd>D</kbd>* | Move right |

`*` The current implementation uses the arrow keys; WASD support is not implemented yet.

- Eat the food to increase your score and grow longer.
- Avoid the board boundaries and the snake's own body.
- When the game ends, select **RELOAD** to start a new round.

## Project Structure

```text
snake-game/
├── index.html   # Game page, canvas, score display, and game-over overlay
├── style.css    # Layout and visual styling
├── app.js       # Game loop, movement, collisions, scoring, and audio
├── img/         # Food and other image assets
└── audio/       # Movement, eating, and game-over sound effects
```

## Built With

- **HTML5** — page structure and game canvas
- **CSS3** — layout and styling
- **JavaScript** — game logic and animation loop
- **Canvas API** — drawing the board, snake, and food
- **HTML Audio API** — sound effects

## How It Works

The game runs a loop approximately every 100 milliseconds. Each update draws the board, moves the snake in its current direction, checks whether food has been eaten, updates the score and snake length, and detects collisions. The game stops when the snake hits a boundary or its own body.

## Contributing

Ideas, bug fixes, and improvements are welcome. To contribute:

1. Fork the repository.
2. Create a branch for your change.
3. Make and test your changes in a browser.
4. Open a pull request describing what changed.

## License

No license is currently specified in this repository. Unless a license is added, the default copyright rules apply and reuse may be restricted.
