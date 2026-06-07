import {useState} from 'react'
import './App.css'

function App() {
    const [guesses, setGuesses] = useState([
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
    ])    
    const [currentRow, setCurrentRow] = useState(0)
    const [currentCol, setCurrentCol] = useState(0)
    const keyboard = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER','Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE']
    ]

    function keyPress(letter) {
        if (currentCol === 5 || currentRow === 6) {
            return;
        }
        if (letter === 'ENTER') {
            setCurrentRow(currentRow++)
        }
        const newArray = guesses.map((row) => [...row])

        if (letter === 'DELETE' && currentCol !== 0) {
            newArray[currentRow][currentCol - 1] = ''
            setCurrentCol(currentCol - 1)
            setGuesses(newArray)
            return;
        }
        newArray[currentRow][currentCol] = letter
        setGuesses(newArray)
        setCurrentCol(currentCol + 1)
        return;
    }
    return (
    <div className="parent">
      <div className="board">
        {guesses.map((row, rowIndex) => (
            <div key={rowIndex} className="word"> 
            {row.map((letter, colIndex) => (
                <div key={colIndex} className="letter">
                    {letter}
                </div>
            ))}
            </div>
        ))}
      </div>
      <div className="keyboard">
        {keyboard.map((row,rowIndex) => (
            <div key={rowIndex} className="keyboardrow"> 
            {row.map((letter,colIndex) => (
                <button onClick = {() => keyPress(letter)} key={colIndex} className={letter === "ENTER" ? "ENTER" : letter === "DELETE" ? "DELETE" : "keyboardletter"}>
                    {letter}
                 </button>
            ))}
            </div>
        ))}
      </div>
    </div>
    )
  }
  
  export default App