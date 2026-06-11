import "./Homepage.css"
import { useNavigate } from 'react-router-dom'

function Homepage() {
    const navigate = useNavigate()

    return (
        <div className="background">
            <div>
                <img src="wordle.png"></img>
            </div>
            <div className="wordleText">
                Wordle
            </div>
            <div className="description">
                <p> Get 6 chances to guess </p>
                <p> a 5-letter word.</p>
            </div>
            <div className="buttonarea">
                <button className="login" onClick = {() => { navigate('/login') }}>Log in</button>
                <button className="play" onClick = {() => { navigate('/game') }}>Play</button>
            </div>
            <div className="bottomtext">
                <p className="date">June 8, 2026</p>
                <p className="rest">No. 1</p>
                <p className="rest">Edited by Aron Chen</p>
            </div>
        </div>
    )

}

export default Homepage