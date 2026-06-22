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
    const [guesses, setGuesses] = useState(JSON.parse(localStorage.getItem('guess')) || [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
    ])      

    const [currentRow, setCurrentRow] = useState(Number(localStorage.getItem('currentrow')) || 0)
    const [justWon, setJustWon] = useState(false)
    const [currentCol, setCurrentCol] = useState(0)
    const [disableInput, setdisableInput] = useState(JSON.parse(localStorage.getItem('gameover')) || false)
    const [showGamePopup, setShowGamePopup] = useState(false)
    const [MessagetoShow, setMessagetoShow] = useState('')
    const [gameOver, isGameOver] = useState(JSON.parse(localStorage.getItem('gameover')) || false)
    const [winRow, setwinRow] = useState(localStorage.getItem('winrow') === null ? null : Number(localStorage.getItem('winrow')))
    const [keyboardColor, setkeyboardColor] = useState({})
    const [showSettings, setShowSettings] = useState(false)
    const [showStatistics, setShowStatistics] = useState(false)
    const [showHowPlay, setShowHowPlay] = useState(localStorage.getItem('howplay') === null)
    const [hardmode, setHardMode] = useState(JSON.parse(localStorage.getItem('hardmode')) || false)
    const [keyboardonly, setkeyboardonly] = useState(JSON.parse(localStorage.getItem('keyboardonly')) || false)
    const keyboard = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER','Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE']
    ]
    function resetGameState() {
        localStorage.removeItem('guess')
        localStorage.removeItem('currentrow')
        localStorage.removeItem('winrow')
        localStorage.removeItem('gameover')
        localStorage.removeItem('keyboardcolor')

        setGuesses([
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
        ])
        setCurrentRow(0)
        setwinRow(null)
        isGameOver(false)
        setkeyboardColor({})
        setdisableInput(false)
    }    

    function reportBug() {
        const deviceSummary = `

    --
    Device summary:
    Page: ${window.location.pathname}
    Platform: Web (${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'})
    Browser: ${getBrowserName()}
    Screen Resolution: ${window.screen.width} x ${window.screen.height}
    Viewport Size: ${window.innerWidth} x ${window.innerHeight}
    Timezone: UTC${-new Date().getTimezoneOffset() / 60 >= 0 ? '+' : ''}${-new Date().getTimezoneOffset() / 60}
    `
        const subject = encodeURIComponent("Wordle Bug Report")
        const body = encodeURIComponent(deviceSummary)

        window.location.href = `mailto:aronchen500@gmail.com?subject=${subject}&body=${body}`
    }
    
    function getBrowserName() {
        const userAgent = navigator.userAgent
        if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
            return "Chrome"
        }
        if (userAgent.includes("Firefox")) {
            return "Firefox"
        }
        if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
            return "Safari"
        }
        if (userAgent.includes("Edg")) {
            return "Edge"
        }
        return "Unknown"
    }

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
        if (!disableInput && !keyboardonly) {
            window.addEventListener('keydown', handleKeyDown)
        }        
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [currentCol, currentRow, disableInput, keyboardonly])
    useEffect(()=> {
        if (JSON.parse(localStorage.getItem('keyboardcolor'))) {
            setTimeout(() => {
                const saved = JSON.parse(localStorage.getItem('keyboardcolor'))
                if (saved) {
                    setkeyboardColor(saved)
                }                
                if (!gameOver) {
                    setdisableInput(false)
                }            
            }, 1800)
        }
        if (gameOver) {
            if (winRow === null) {
                setShowGamePopup(true)
                setMessagetoShow(currentWord.toUpperCase())
            }
            
        }
        localStorage.setItem('howplay', true)
        const savedPuzzleNumber = localStorage.getItem('puzzleNumber')
        if (Number(savedPuzzleNumber) !== daysDifference) {
                localStorage.setItem('puzzleNumber', daysDifference)
                resetGameState()
        }


    }, [])
    localStorage.clear()
    function getGreenPositions() {
        const greenPositions = []
            for (let r = 0; r < currentRow; r++) {
                for (let c = 0; c < 5; c++) {
                    const letter = guesses[r][c].toLowerCase()
                    if (letter && letter === currentWord[c]) {
                        greenPositions.push({ position: c, letter })
                    }
                }
            }
        return greenPositions
    }
    function determineKeyboardColor(word) {
        word.split('').forEach((letter, colIndex) => {
            setkeyboardColor(prev => {
                const newobj = {...prev}
                if (newobj[letter.toLowerCase()] === 'green') {
                    return newobj
                }
                if (letter.toLowerCase() === currentWord[colIndex]) {
                    newobj[letter.toLowerCase()] = 'green'
                } else if (currentWord.includes(letter.toLowerCase())) {
                    newobj[letter.toLowerCase()] = 'yellow'
                } else {
                    newobj[letter.toLowerCase()] = 'gray'
                }
                localStorage.setItem('keyboardcolor', JSON.stringify(newobj))
                return newobj
            })
        })
    }
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
            let hardModeFail = false
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
                    localStorage.setItem('guess', JSON.stringify(guesses))
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
                        determineKeyboardColor(word)
                        setwinRow(currentRow)
                        localStorage.setItem('winrow', currentRow)
                    },1800)
                    setdisableInput(true)
                    setJustWon(true)
                    setTimeout(() => {
                        isGameOver(true)
                        localStorage.setItem('gameover', JSON.stringify(true))
                    },3600)
                    setTimeout(()=> {
                        setShowGamePopup(true)
                    },1800)
                    setTimeout(() => {
                        setShowGamePopup(false)
                    }, 5000)
                }
                else {
                    if (hardmode) {
                    
                        const greenPositions = getGreenPositions()
                        for (let i = 0; i < greenPositions.length; i++) {
                            const position = greenPositions[i].position
                            const letter = greenPositions[i].letter
                            if (word[position] !== letter) {
                                let lastcoupleletters
                                switch(position + 1) {
                                    case 1:
                                        lastcoupleletters = 'st'
                                        break
                                    case 2:
                                        lastcoupleletters = 'nd'
                                        break
                                    case 3:
                                        lastcoupleletters = 'rd'
                                        break
                                    case 4:
                                        lastcoupleletters = 'th'
                                        break
                                    case 5:
                                        lastcoupleletters = 'th'
                                        break
                                }
                                setShowGamePopup(true)
                                setShakeRow(currentRow)
                                setMessagetoShow(`${position + 1}${lastcoupleletters} letter must be ${letter.toUpperCase()}`)
                                hardModeFail = true
                                break
                            }
                        }
                    
                        if (!hardModeFail) {
                            const keyboardEntries = Object.entries(keyboardColor)
                            for (let i = 0; i < keyboardEntries.length; i++) {
                                const key = keyboardEntries[i][0]
                                const value = keyboardEntries[i][1]
                                if (value === 'yellow' && !word.includes(key)) {
                                    setShowGamePopup(true)
                                    setShakeRow(currentRow)
                                    setMessagetoShow(`Guess must contain ${key.toUpperCase()}`)
                                    hardModeFail = true
                                    break
                                }
                            }
                        }
                    
                        if (hardModeFail) {
                            setTimeout(() => {
                                setShakeRow(null)
                            }, 500)
                            setTimeout(() => {
                                setShowGamePopup(false)
                            }, 2000)
                        }
                    }
                    if (!hardModeFail) {
                        localStorage.setItem('guess', JSON.stringify(guesses))
                    setTimeout(() => {
                        setdisableInput(false)
                        determineKeyboardColor(word)

                        if (currentRow + 1 === 6) {
                            setTimeout(()=> {
                                isGameOver(true)
                                setShowGamePopup(true)
                                setMessagetoShow(currentWord.toUpperCase())
                                localStorage.setItem('gameover', JSON.stringify(true))

                            }, 700)
                        }
                    },1800)
                    setdisableInput(true)

                    }
                    
                }
                if (!hardModeFail) {
                    localStorage.setItem('currentrow', currentRow+1)
                    setCurrentRow(currentRow + 1)
                    setCurrentCol(0)
                    sethardmodereq(false)

                }

                
                
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
                            if (!hardmode) {
                                if (currentRow > 0 || justWon) {
                                    setShowGamePopup(true)
                                    setMessagetoShow("Hard mode can only be enabled at the start of a round")
                                    setTimeout(() => {
                                        setShowGamePopup(false)
                                    }, 1500)
                                    if (gameOver && winRow === null) {
                                        setTimeout(()=> {
                                            setShowGamePopup(true)
                                            setMessagetoShow(currentWord.toUpperCase())
                                        }, 1500)
                                    }
                                    return
                                }
                            }
                            setHardMode(!hardmode)
                            localStorage.setItem('hardmode', JSON.stringify(!hardmode))
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
                            localStorage.setItem('keyboardonly', JSON.stringify(!keyboardonly))
                            setKeyboardOnlyInteracted(true)
                        }} className={keyboardonly ? "greenbutton" : "graybutton"}>
                             <div className ='circle'></div>
                        </button>            
                    </div>
                    <div className="individual" style={{border:"none"}}>
                        <div className="settingsmalltext">&copy; 2026 The Aron Times Company</div>
                        <div className="settingsmalltext">#{daysDifference}</div>
                    </div>

                </div>
            </div>


        </div>
        }
        {showHowPlay &&
        <div className="settingsbackground">
            <div className="howplaypopup">
            <div className="Showhowplayclosebutton">     
                <button className="closebutton" onClick={()=> {
                        setdisableInput(false)
                        setShowHowPlay(false)
                    }}>
                    <img  style={{height:"40px", width:"40px"}}src="/Xbutton.png"/>
                </button>
                </div>
            <div>
                <div className="howplay">How To Play</div>
                <div className="guess6">Guess the Wordle in 6 tries. </div>
            </div>
            <div>
                <ul>
                    <li>Each guess must be a valid 5-letter word.</li>
                    <li>The color of the tiles will change to show how close your guess was to the word.</li>
                </ul>
            </div>
            <div className="examples">
                <span>Examples</span>
                <div className="wordy">
                    <div className="W">W</div>
                    <div>O</div>
                    <div>R</div>
                    <div>D</div>
                    <div>Y</div>
                </div>
                <p><b>W </b>is in the word and in the correct spot.</p>
            </div>
            <div className="light">
            <div className="wordy">
                    <div className="L">L</div>
                    <div>I</div>
                    <div>G</div>
                    <div>H</div>
                    <div>T</div>
            </div>                    
                <p><b>I</b> is in the word but in the wrong spot.</p>
            </div>
            <div className="rogue">
            <div className="wordy">
                    <div >R</div>
                    <div>O</div>
                    <div>G</div>
                    <div className="U">U</div>
                    <div>E</div>
            </div>                       
            <p><b>U</b> is not in the word in any spot.</p>
            </div>
            <div className="howplayfooter">
                <div>
                    </div>
                    <button onClick={reportBug}>
                    Report a Bug
                    </button>              
            </div>
            </div>
        

        </div>
        }
        {showStatistics &&
        <div className="settingsbackground">
            <div className="statisticpopup">
                <div className="statisticclosebutton">     
                <button className="closebutton" onClick={()=> {
                        setdisableInput(false)
                        setShowStatistics(false)
                    }}>
                    <img  style={{height:"40px", width:"40px"}}src="/Xbutton.png"/>
                </button>
                </div>
                <div className="statistictext">
                    Statistics
                </div>
                <div className="statisticbody">
                    <img style={{height:"300px", width:"220px"}}src="/statistic.png"/>
                    <div className="statistictrack">
                        Track your stats and view badges.
                    </div>
                    <div className="statisticaccess">
                        Access your Wordle badges, win percentage and more with a free account.
                    </div>
                    <button onClick={()=> navigate('/login')}className="createfreebutton">
                        Create a free account
                    </button>
                </div>
            </div>
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
                <div key={letter === '' ? `${rowIndex}${colIndex}` :`${rowIndex}${colIndex}${letter}`} className={winRow === rowIndex && justWon? 'jump' : determineColor(letter, colIndex, rowIndex)} style={{ animationDelay: `${colIndex * 0.3}s` }}>
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
        <div className="footer">
                <a>&copy; The Aron Times Company</a>
                <div>|</div>
                <a>AronTimes.com</a>
                <div>|</div>
                <a>Sitemap</a>
                <div>|</div>
                <a>Privacy Policy</a>
                <div>|</div>
                <a>Terms of Service</a>
                <div>|</div>
                <a>Cookie Policy</a>
                <div>|</div>
                <a>Terms of Sale</a>
                <div>|</div>
                <a>Your Privacy Choices</a>
        </div>
    </div>
    )
  }
  
  export default App