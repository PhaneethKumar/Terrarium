# My Terrarium

A small interactive web page built as part of the Microsoft Developer Advocate's Intro to Web Development course. This terrarium showcases the fundamentals of HTML, CSS, and JavaScript by combining a responsive layout with drag-and-drop plant placement, sound effects, and a polished garden-themed UI.

## Live Demo

[Welcome to my Virtual Terrarium](https://phaneethkumar.github.io/Terrarium/)

## Overview

This project is a virtual terrarium where you can arrange different plants inside a glass container. The plants can be dragged around the scene, layered visually, and reset to their original positions. The app also includes subtle audio cues and a clean, modern style inspired by a cozy indoor garden.

## Features

- Drag-and-drop plant placement inside the terrarium
- Responsive layout that adapts to different screen sizes
- Reset button to restore the original arrangement
- Animated plant movement and hover effects
- Simple sound interactions for plant pickup and placement

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Font Awesome icons

## Project Structure

```text
Terrarium/
├── .github/workflows/   # GitHub Actions workflow(s)
├── index.html
├── style.css
├── script.js
├── README.md
├── images/
    ├── plant1.png
    ├── plant2.png
    ├── ...
    └── plant14.png

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

- A navigation bar and header for the terrarium theme
- A central container where plants can be moved around
- A styled glass jar and soil base to give the scene its terrarium appearance
- JavaScript logic that handles dragging, z-index layering, layout persistence, sound effects and reset behavior

## Learning Notes

This project was a practical introduction to:

- Structuring web pages with semantic HTML
- Styling with CSS layout techniques and responsive design
- Adding interactivity with JavaScript events and pointer tracking
- Working with local storage to persist custom plant layouts
- Creating a small, polished front-end experience from scratch

## Credits

Assignment from [Web Development for Beginners](https://github.com/microsoft/Web-Dev-For-Beginners) by Microsoft. All code and content in this repository are my own work.
