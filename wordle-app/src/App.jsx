import {useState, useEffect} from 'react'
import './App.css'

function App() {
    const currentword = 'LOVER'
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

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            keyPress('ENTER')
        }
        else if (e.key === 'Backspace') {
            keyPress('DELETE')
        }
        else if (e.key.match(/^[a-zA-Z]$/)) {  
            keyPress(e.key.toUpperCase())
        }
        return;
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [currentCol, currentRow])

    function determineColor(letter, colIndex, rowIndex) {
        if (letter.length === 0) {
            return "letter"
        }
        if (rowIndex === currentRow) {
            return "letterwithborder"
        }
        if (letter === currentword[colIndex]) {
            return "green"
        }
        if (currentword.includes(letter)) {
            return "yellow"
        }
        else {
            return "gray"
        }
    }
    function keyPress(letter) {
        if (currentCol === 5) {
            if (letter === 'ENTER' && currentRow !== 6) {
                setCurrentRow(currentRow + 1)
                setCurrentCol(0)
                return
            }
            if (letter !== 'DELETE') {
                return;
            }
            
        }
        const newArray = guesses.map((row) => [...row])
        if (letter === 'DELETE') {
            if (currentCol === 0) {
                return;
            }
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
                <div key={letter === '' ? `${rowIndex}${colIndex}` :`${rowIndex}${colIndex}${letter}`} className={determineColor(letter, colIndex, rowIndex)}>
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