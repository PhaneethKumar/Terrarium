# My Terrarium

A small interactive web project built as part of the Microsoft Developer Advocate intro to web development course. This terrarium showcases the fundamentals of HTML, CSS, and JavaScript by combining a responsive layout with drag-and-drop plant placement, sound effects, and a polished garden-themed UI.

## Live Demo

[Welcome to my Virtual Terrarium](https://terrarium-khaki.vercel.app/)

## Overview

This project is a virtual terrarium where you can arrange different plants inside a glass container. The plants can be dragged around the scene, layered visually, and reset to their original positions. The app also includes subtle audio cues and a clean, modern style inspired by a cozy indoor garden.

## Features

- Drag-and-drop plant placement inside the terrarium
- Responsive layout that adapts to different screen sizes
- Reset button to restore the original arrangement
- Animated plant movement and hover effects
- Simple sound interactions for plant pickup and placement
- A plant care guide section for a more complete themed experience

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Font Awesome icons

## Project Structure

```text
Terrarium/
├── index.html
├── style.css
├── script.js
├── README.md
├── images/
│   ├── plant1.png
│   ├── plant2.png
│   ├── ...
│   └── plant14.png
└── .gitignore
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   cd Terrarium
   ```

2. Open the project in a browser:
   - You can simply open `index.html` in a browser, or
   - Run a local static server from the project folder.

3. If you want to use a local server:

   ```bash
   python -m http.server 8000
   ```

4. Visit:

   ```text
   http://localhost:8000
   ```

## How It Works

The page is structured with:

- a navigation bar and header for the terrarium theme
- a central container where plants can be moved around
- a styled glass jar and soil base to give the scene its terrarium appearance
- JavaScript logic that handles dragging, z-index layering, layout persistence, and reset behavior

## Learning Notes

This project was a practical introduction to:

- structuring web pages with semantic HTML
- styling with CSS layout techniques and responsive design
- adding interactivity with JavaScript events and pointer tracking
- working with local storage to persist custom plant layouts
- creating a small, polished front-end experience from scratch

## Credits

This project was created as part of a beginner-friendly web development learning path and serves as a hands-on exercise in building an interactive front-end application.

## License

This project is for educational purposes and is intended as a learning exercise.

