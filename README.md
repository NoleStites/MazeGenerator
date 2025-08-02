# Maze Generator App  
A Full-Stack App using C# (.NET) Backend and React Frontend

## Overview

Maze Generator is a full-stack application that allows users to generate customizable mazes and visualize the layout dynamically. It's built with a **C# .NET backend** and a **React frontend**, showcasing full-stack development skills, responsive design, and modern UI techniques.

This project demonstrates:

- Backend development with C# and .NET
- RESTful API integration
- Interactive frontend with React
- Dynamic DOM manipulation and styling
- Clean, responsive layout using CSS Flexbox & Table Grids

---

## Technologies Used

### Backend
- **C#** (.NET 7)
- **ASP.NET Web API**
- JSON-based endpoints for maze data

### Frontend
- **React** (Vite)
- **CSS Modules** for styling
- React state management for dynamic rendering
- Custom input UI for user-generated maze parameters

---

## Features

- Adjustable maze dimensions (width, height)
- Configurable wall and cell sizes
- Accurate cell spacing and borders using programmatic styling
- Scrollable viewport for oversized mazes
- Real-time visual updates as user changes values

---

## Running the Project

### 1. Backend (C# API)
```bash
cd server
dotnet run
```
API runs by default on `https://localhost:5195`

### 2. Frontend (React)
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` and fetches maze data from the backend API.

---

## Example API Call

**GET** `/initializeMaze?width=3&height=3`

**Response**
```json
[
  [["left", "top", "bottom"], ["right", "top"], ["left", "top"]],
  [["bottom"], ["right", "top"], ["bottom", "right"]],
  [["left", "bottom"], ["bottom"], ["bottom", "right"]]
]
```
Each square cell in the maze contains a list of sides that need to have borders/walls, thus creating a maze structure.

---

## File Structure

```
MazeGenerator/
├── server/         # ASP.NET Core Web API
│   └── Program.cs
├── client/       # React app
│   ├── src/
│       └── App.jsx
```

---

## For the Employers

✅ Full-stack proficiency using **C#** and **React**  
✅ Solid understanding of **DOM rendering**, **CSS layout**, and **component design**  
✅ Comfort with **asynchronous logic** and API interaction  
✅ Attention to **responsive design** and **code readability**

---

## Future Enhancements

- Maze-solving algorithm & animation
- Different maze-generation algorithms
- Downloadable maze image
- Leaderboards or puzzle challenges
- Theming system (light/dark mode)

---

## License

MIT License. Feel free to fork or adapt!