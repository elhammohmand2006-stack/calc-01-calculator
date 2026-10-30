# CALC-01 Calculator

A responsive calculator built with HTML, CSS and vanilla JavaScript. It supports chained calculations, keyboard input, a history tape, and light and dark themes.

**Live demo:** https://elhammohmand2006-stack.github.io/calc-01-calculator/

## Features

- Addition, subtraction, multiplication and division
- Chained calculations (`2 + 3 +` shows `5` before you continue)
- Percent (`%`), change sign (`±`), delete (`⌫`) and clear (`AC`) keys
- Error message when dividing by zero
- Correct decimal results (`0.1 + 0.2 = 0.3`)
- History of the last 8 calculations; click one to reuse its result
- Keyboard support: digits, `+ - * /`, `Enter`, `Backspace`, `Escape`
- Light and dark themes (saved in the browser)
- Fully responsive: works on phones, tablets and computers

## Built with

- HTML5
- CSS3 (variables, grid, 3D-style keys)
- JavaScript (ES6)

## Project structure

```
calc-01-calculator/
├── index.html   # page structure
├── style.css    # styles, themes and responsive layout
└── script.js    # calculator logic
```

## How to run

1. Download or clone this repository.
2. Open `index.html` in your browser.

## JavaScript concepts used

- Variables, strings and numbers (`parseFloat`, `toFixed`)
- Functions and a `state` object
- `switch` and `if / else`
- Event delegation with `data-action` and `data-value`
- Keyboard events
- Arrays (`unshift`, `slice`, `forEach`)
- `localStorage` with `JSON.stringify` and `JSON.parse`

## Credits

Inspired by a class project on building a calculator with CSS and JavaScript.

## Author

Elham
