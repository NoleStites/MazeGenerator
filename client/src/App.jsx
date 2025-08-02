// npm run dev
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react';
import styles from './Maze.module.css';

function App() {
  const [width, setWidth] = useState(9); // Width of the maze in cells
  const [height, setHeight] = useState(9); // Height of the maze in cells
  const [mazeWallWidth, setMazeWallWidth] = useState(10); // Wall width in pixels
  const [mazeCellSize, setMazeCellSize] = useState(80); // Cell size in pixels
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
        console.log('Maze data:', json);
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
    const cells = document.querySelectorAll('td'); // Select all table cells
    cells.forEach(cell => {
      cell.style.border = 'none'; // Reset all borders
    });
  }

  // Assigns borders to maze cells based on the maze data
  function createMazeBorders(width, height, borderWidth, mazeData) {
    // Define border styles
    let borderStyle = `${borderWidth}px solid black`;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        // console.log(mazeData[i][j]);
        const cell = document.getElementById(`cell-${i}-${j}`);

        if (cell) {
          let direction_string = "";

          for (let direction of mazeData[i][j]) {
            direction_string += direction + " ";
            if (direction === 'right') { // Set right border
                cell.style.borderRight = borderStyle; 
            } 
            else if (direction === 'bottom') { // Set bottom border
                cell.style.borderBottom = borderStyle; 
            }
            else if ((direction === 'left') && (j === 0)) { // Set left border
                cell.style.borderLeft = borderStyle; 
            }
            else if ((direction === 'top') && (i === 0)) { // Set top border
                cell.style.borderTop = borderStyle; 
            }
          }
        }
      }
    }
    // Create start and end openings
    const startCell = document.getElementById(`cell-0-0`);
    const endCell = document.getElementById(`cell-${height - 1}-${width - 1}`);
    startCell.style.borderTop = 'none'; // Remove top border for start cell
    endCell.style.borderBottom = 'none'; // Remove bottom border for end cell
  }

  const handleGeneratePath = () => {
    resetMazeBorders(); // reset borders before generating new maze
    setGenerate(true); // trigger useEffect
  };

  return (
    <div className={styles.app}>
      <div className={styles.content}>
        <div className={styles.pageLeft}>
          <div className={styles.card}><h1>Maze Generator</h1></div>
          <div className={styles.card}>
            <div className={styles.mazeControls}>
              <label>
                Width:
                <input
                  type="number"
                  value={width}
                  onChange={(e) => {
                    setWidth(Number(e.target.value));
                    handleGeneratePath(); // regenerate maze on width change
                  }}
                  min="2"
                  max="50"
                />
              </label>
              <label>
                Height:
                <input
                  type="number"
                  value={height}
                  onChange={(e) => {
                    setHeight(Number(e.target.value));
                    handleGeneratePath(); // regenerate maze on width change
                  }}
                  min="2"
                  max="50"
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
              <label>
                Cell Size (px):
                <input
                  type="number"
                  value={mazeCellSize}
                  onChange={(e) => setMazeCellSize(Number(e.target.value))}
                  min="15"
                  max="200"
                  step="10"
                />
              </label>
            </div>
            <button className={styles.generateButton} onClick={handleGeneratePath}>Generate</button>
          </div>
        </div>
        <div className={styles.pageRight}>
          <div className={`${styles.mazeContainerTable} ${styles.card}`}>
              <table>
                  <tbody>
                      <Maze width={width} height={height} wallWidth={mazeWallWidth} cellSize={mazeCellSize} />
                  </tbody>
              </table>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Nole Stites. All rights reserved.
      </footer>
    </div>
  )
}

// Maze component that renders the maze grid
function Maze({ width, height, wallWidth, cellSize }) {
  const maze = [];

  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      // const randomRGB = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
      row.push(
        <td
          key={`cell-${i}-${j}`}
          className={styles.mazeCellTable}
          id={`cell-${i}-${j}`}
          style={{ borderWidth: `${wallWidth}px`, width: `${cellSize}px`, height: `${cellSize}px`, boxSizing: 'border-box'}}
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
