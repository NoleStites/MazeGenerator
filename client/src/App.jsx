// npm run dev
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react';
import styles from './Maze.module.css';

function App() {
  const [width, setWidth] = useState(6); // Width of the maze in cells
  const [height, setHeight] = useState(6); // Height of the maze in cells
  const [mazeWallWidth, setMazeWallWidth] = useState(6); // Wall width in pixels
  const [mazeData, setMazeData] = useState(null); // Store the maze data fetched from the server
  const [generate, setGenerate] = useState(false); // triggers fetch

  useEffect(() => {
    if (!generate) return;

    const fetchMaze = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/initializeMaze?width=${width}&height=${height}`
        );
        const text = await res.text();
        const json = JSON.parse(text);
        setMazeData(json); // store the maze data
        // console.log('Maze data:', json);
        createMazeBorders(width, height, mazeWallWidth, json);
      } catch (err) {
        console.error('Failed to fetch maze:', err);
      } finally {
        setGenerate(false); // reset trigger
      }
    };

    fetchMaze();
  }, [generate, width, height]);

  function resetMazeBorders() {
    const cells = document.querySelectorAll(`.${styles.mazeCellTable}`);
    cells.forEach(cell => {
      cell.style.border = `${mazeWallWidth}px solid transparent`; // Reset all borders
    });
  }

  // Assigns borders to maze cells based on the maze data
  function createMazeBorders(width, height, borderWidth, mazeData) {
    // Define border styles
    let innerBorderStyle = `${borderWidth}px solid black`;
    let outerBorderStyle = `${borderWidth}px solid black`;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        // console.log(mazeData[i][j]);
        const cell = document.getElementById(`cell-${i}-${j}`);
        if (cell) {
          for (let direction of mazeData[i][j]) {
            if (direction === 'left') { // Set left border
              if (j === 0) {
                cell.style.borderLeft = outerBorderStyle; 
              }
              else {
                cell.style.borderLeft = innerBorderStyle;
              }
            } else if (direction === 'right') { // Set right border
              if (j === width - 1) {
                cell.style.borderRight = outerBorderStyle; 
              }
              else {
                cell.style.borderRight = innerBorderStyle;
              }
            } else if (direction === 'top') { // Set top border
              if (i === 0) {
                cell.style.borderTop = outerBorderStyle; 
              }
              else {
                cell.style.borderTop = innerBorderStyle;
              }
            } else if (direction === 'bottom') { // Set bottom border
              if (i === height - 1) {
                cell.style.borderBottom = outerBorderStyle; 
              }
              else {
                cell.style.borderBottom = innerBorderStyle;
              }
            }
          }
        }
      }
    }
    // Create start and end openings
    const startCell = document.getElementById(`cell-0-0`);
    // const endCell = document.getElementById(`cell-${width - 1}-${height - 1}`);
    const endCell = document.getElementById(`cell-${height - 1}-${width - 1}`);
    startCell.style.borderTop = 'none'; // Remove top border for start cell
    endCell.style.borderBottom = 'none'; // Remove bottom border for end cell
  }

  const handleGeneratePath = () => {
    resetMazeBorders(); // reset borders before generating new maze
    setGenerate(true); // trigger useEffect
  };

  return (
    <>
      <h1>Maze Generator</h1>
      <button onClick={handleGeneratePath}>Generate Path</button>
      <div className={styles.mazeControls}>
        <label>
          Width:
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            min="2"
            max="20"
          />
        </label>
        <label>
          Height:
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            min="2"
            max="20"
          />
        </label>
        <label>
          Wall Width (px):
          <input
            type="number"
            value={mazeWallWidth}
            onChange={(e) => setMazeWallWidth(Number(e.target.value))}
            min="1"
            max="20"
          />
        </label>
      </div>
      <div className={styles.mazeContainerTable}>
          <table>
              <tbody>
                  <Maze width={width} height={height} />
              </tbody>
          </table>
      </div>
    </>
  )
}

// Maze component that renders the maze grid
function Maze({ width, height }) {
  const maze = [];

  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      row.push(
        <td
          key={`cell-${i}-${j}`}
          className={styles.mazeCellTable}
          id={`cell-${i}-${j}`}
        />
      );
    }

    maze.push(
      <tr key={`row-${i}`} className={styles.mazeRowTable}>
        {row}
      </tr>
    );
  }

  return maze;
}

export default App
