import {useState, useEffect} from 'react'
import './App.css'
import { validWords, answerList } from './wordlist.js'
import {useNavigate} from 'react-router-dom'

function App() {
    const startDate = new Date(2021,5,19)
    const today = new Date()
    const daysDifference = Math.floor((today-startDate) / (1000*60*60*24))
    const currentWord = answerList[daysDifference % answerList.length]
    const [shakeRow, setShakeRow] = useState(null)
    const navigate = useNavigate()
    const [showBurger, setShowBurger] = useState(false)
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
    const [disableInput, setdisableInput] = useState(false)
    const [showGamePopup, setShowGamePopup] = useState(false)
    const [MessagetoShow, setMessagetoShow] = useState('')
    const [gameOver, isGameOver] = useState(false)
    const [winRow, setwinRow] = useState(null)
    const [keyboardColor, setkeyboardColor] = useState({})
    const [showSettings, setShowSettings] = useState(false)
    const [showStatistics, setShowStatistics] = useState(false)
    const [showHowPlay ,setShowHowPlay] = useState(false)
    const [hardmode, setHardMode] = useState(false)
    const [keyboardonly, setkeyboardonly] = useState(false)
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
        return
    }
    useEffect(() => {
        if (!disableInput) {
            window.addEventListener('keydown', handleKeyDown)
        }        
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [currentCol, currentRow, disableInput])

    function determineColor(letter, colIndex, rowIndex) {
        if (letter.length === 0) {
            return "letter"
        }
        if (rowIndex === currentRow) {
            return "letterwithborder"
        }
        if (letter.toLowerCase() === currentWord[colIndex]) {
            return "green"
        }
        if (currentWord.includes(letter.toLowerCase())) {
            return "yellow"
        }
        else {
            return "gray"
        }
    }
    function keyPress(letter) {
        if (disableInput) {
            return
        }
        if (currentCol === 5) {
            if (letter === 'ENTER' && currentRow !== 6) {
                const word = guesses[currentRow].join('').toLowerCase();
                if (!validWords.includes(word)) {
                    setMessagetoShow("Not in word list")
                    setShowGamePopup(true)
                    setShakeRow(currentRow)
                    setTimeout(() => {
                        setShakeRow(null)
                    }, 500)
                    setTimeout(() => {
                        setShowGamePopup(false)
                    }, 2000)
                    return
                }
                else if (word === currentWord) {
                    if (currentRow === 0) {
                        setMessagetoShow("Genius")
                    }
                    if (currentRow === 1) {
                        setMessagetoShow("Magnificient")
                    }
                    if (currentRow === 2) {
                        setMessagetoShow("Impressive")
                    }
                    if (currentRow === 3) {
                        setMessagetoShow("Splendid")
                    }
                    if (currentRow === 4) {
                        setMessagetoShow("Great")
                    }
                    if (currentRow === 5) {
                        setMessagetoShow("Phew")
                    }
                    setTimeout(() => {
                        setwinRow(currentRow)
                    },1800)
                    setdisableInput(true)
                    setTimeout(() => {
                        isGameOver(true)
                    },3600)
                    setTimeout(()=> {
                        setShowGamePopup(true)
                    },1800)
                    setTimeout(() => {
                        setShowGamePopup(false)
                    }, 5000)
                }
                else {
                    setTimeout(() => {
                        setdisableInput(false)
                        word.split('').forEach((letter, colIndex) => {
                            setkeyboardColor(prev => {
                                const newobj = {...prev}
                                if (letter.toLowerCase() === currentWord[colIndex]) {
                                    newobj[letter.toLowerCase()] = 'green'
                                } else if (currentWord.includes(letter.toLowerCase())) {
                                    newobj[letter.toLowerCase()] = 'yellow'
                                } else {
                                    newobj[letter.toLowerCase()] = 'gray'
                                }
                                return newobj
                            })
                        })
                    },1800)
                    setdisableInput(true)
                }
                setCurrentRow(currentRow + 1)
                setCurrentCol(0)
                
                
            }
            if (letter !== 'DELETE') {
                return;
            }
        }
            

        if (letter === 'ENTER' && currentCol !== 5) {
            setMessagetoShow("Not enough letters")
            setShowGamePopup(true)
            setShakeRow(currentRow)
            setTimeout(() => {
                setShakeRow(null)
            }, 500)
            setTimeout(() => {
                setShowGamePopup(false)
            }, 2000)
            return;
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
        {showSettings &&
        <div className="settingsbackground">
            <div className="settingspopup">
                <div className="settingstext">
                    <div>SETTINGS </div>
                    <button style={{position:"absolute", right:"-8px"}}className="closebutton" onClick={()=> {
                        setdisableInput(false)
                        setShowSettings(false)
                    }}>
                    <img  style={{height:"40px", width:"40px"}}src="/Xbutton.png"/>
                    </button>

                </div>
                <div className="settingbody">
                    <div className="individual">
                        <div>
                            <div className="settingbigtext">Hard Mode</div>
                            <div className="settingsmalltext">Any revealed hints must be used in subsequent guesses</div>
                        </div>
                        <button onClick={() => {
                            setHardMode(!hardmode)
                            setHardModeInteracted(true)
                        }} className={hardmode ? "greenbutton" : "graybutton"}>
                            <div className='circle'></div>
                        </button>
                    </div>
                    <div className="individual">
                        <div>
                            <div className="settingbigtext">Onscreen Keyboard Input Only </div>
                            <div className="settingsmalltext" style={{width:"400px"}}>Ignore key input except from the onscreen keyboard. Most helpful for users using speech recognition or other assitive devices. </div>
                        </div>
                        <button onClick={() => {
                            setkeyboardonly(!keyboardonly)
                            setKeyboardOnlyInteracted(true)
                        }} className={keyboardonly ? "greenbutton" : "graybutton"}>
                             <div className ='circle'></div>
                        </button>            
                    </div>
                    <div className="individual" style={{border:"none"}}>
                        <div className="settingsmalltext">&copy; 2026 The Aron Times Company</div>
                        <div className="settingsmalltext">#1</div>
                    </div>

                </div>
            </div>


        </div>
        }
        {showHowPlay &&
        <div className="settingsbackground">
            <div>
            </div>
        </div>
        }
        {showStatistics &&
        <div>
        </div>
        
        }

      <div className="header">
        <div className="hamburgerdiv">
            <button className="hamburgerbutton" onClick={() => {
                setdisableInput(true)
                setShowBurger(true)
                }}> 
                <img style= {{height:"40px", width:"45px"}}src="hamburger.png"/> 
            </button>
        </div>
        <div className="rightside">
            <button onClick={() => {
                setdisableInput(true)
                setShowStatistics(true)
            }}>
                <img src="/statistics.png"/>
            </button>
            <button onClick={() => {
                setdisableInput(true)
                setShowHowPlay(true)
            }}>
                <img src="/whitequestionmark.png"/>
            </button>
            <button onClick={()=>  {          
                    setdisableInput(true)
                    setShowSettings(true)}}>
                <img src="/settings.png"/>
            </button>
        </div>
      </div>
      <div className="board">
        {showGamePopup &&
        <div className={"popupmessage"}>{MessagetoShow}</div>
        
        }
        {guesses.map((row, rowIndex) => (
            <div key={rowIndex} className={shakeRow === rowIndex ? "wordanimation" : "word"}> 
            {row.map((letter, colIndex) => (
                <div key={letter === '' ? `${rowIndex}${colIndex}` :`${rowIndex}${colIndex}${letter}`} className={winRow === rowIndex ? 'jump' : determineColor(letter, colIndex, rowIndex)} style={{ animationDelay: `${colIndex * 0.3}s` }}>
                    {letter}
                </div>
            ))}
            </div>
        ))}
      </div>
      {!gameOver && 
        <div className="keyboard">
        {keyboard.map((row,rowIndex) => (
            <div key={rowIndex} className="keyboardrow"> 
            {row.map((letter,colIndex) => (
                <button onClick = {() => keyPress(letter)} key={colIndex} className={keyboardColor[letter.toLowerCase()] === 'green' ? 'keyboardgreen' : keyboardColor[letter.toLowerCase()] === 'yellow' ? 'keyboardyellow' : keyboardColor[letter.toLowerCase()] === 'gray' ? 'keyboardgray' : letter === "DELETE" ? "DELETE" : letter === "ENTER" ? "ENTER" : "keyboardletter"
            }>
                    {letter}
                </button>
            ))}
            </div>
        ))}
      </div> 
      }
      {gameOver &&
        <div className="gameoverbuttons">
            <button className="resultbutton">See Results</button>
            <button onClick={()=> navigate('/')} className="homebutton">Home</button>
        </div>
      }
      
      <div className={showBurger ? "overlay" : "overlayHidden"}>
        <div className="overlayheader">
            <button className="closebutton" onClick={() => {
                setdisableInput(false)
                setShowBurger(false)}}>
                <img style={{width:"32px", height:"32px"}} src="/Xbutton.png" />
            </button>
        </div>
        <img style={{width:"100%", height:"200px"}}src="/wordlebackground.png"/>
        <div className="privacysection">
            <div style={{paddingLeft:"20px"}}>Privacy Settings</div>
            <div className="privacy" >
                    <button>Privacy Policy</button>

                    <button>Cookie Policy</button>

                    <button>Privacy FAQ</button>

                    <button>Delete My Account</button>

                    <button>Your Privacy Choices</button>
            </div>

        </div>
        <div className="logoutsection">
            <button className="bottomhome" onClick={()=> navigate('/')}>HOME</button>
            <button className="bottomloginbutton" onClick={() =>navigate('/login')}>LOG IN</button>

        </div>
       </div>

    </div>
    )
  }
  
  export default App