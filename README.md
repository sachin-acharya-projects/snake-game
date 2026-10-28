# Snake Game

A classic Snake game built with **HTML, CSS, and vanilla JavaScript**. Move the snake around the board, eat food to grow, and avoid colliding with the walls or your own body.

## Features

- Grid-based gameplay rendered with the HTML Canvas API
- Arrow-key controls that prevent immediate 180-degree turns
- Score counter and growing snake
- Sound effects for movement, eating, and game over
- Game-over overlay with a restart button
- Responsive layout and no build step or third-party dependencies

## Getting Started

### Run locally

Clone the repository:

```bash
git clone https://github.com/sachin-acharya-projects/snake-game.git
cd snake-game
```

Open `index.html` in your browser. No dependency installation is required.

Alternatively, run a local static server with Python:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## How to Play

| Key | Action |
| --- | --- |
| `↑` | Move up |
| `↓` | Move down |
| `←` | Move left |
| `→` | Move right |

- Eat food to increase your score and grow the snake.
- Avoid the board boundaries and the snake's body.
- Select **PLAY AGAIN** after game over to restart.

## Project Structure

```text
snake-game/
├── index.html   # Game markup and canvas
├── style.css    # Responsive layout and component styles
├── app.js       # Game state, controls, collision checks, and rendering
├── LICENSE      # MIT License
├── img/         # Food and other image assets
└── audio/       # Game sound effects
```

## Built With

- **HTML5** for document structure and the canvas element
- **CSS3** for layout and responsive styling
- **JavaScript** for game state, controls, and game logic
- **Canvas API** for rendering the board, snake, and food
- **HTML Audio API** for sound effects

## Contributing

Bug fixes and improvements are welcome:

1. Fork the repository.
2. Create a branch for your change.
3. Test the game in a browser.
4. Open a pull request describing your changes.

## License

This project is licensed under the [MIT License](./LICENSE).
