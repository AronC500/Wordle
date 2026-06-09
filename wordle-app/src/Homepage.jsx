import "./Homepage.css"

function Homepage() {
    return (
        <div className="background">
            <div>
                <img src="./public/wordle.png"></img>
            </div>
            <div className="wordleText">
                Wordle
            </div>
            <div className="description">
                Get 6 chances to guess a 5-letter word.
            </div>
            <div className="buttonarea">
                <button className="login">Log in</button>
                <button className="play">Play</button>
            </div>
            <div>
                <p className="date">June 8, 2026</p>
                <p className="rest">No. 1</p>
                <p className="rest">Edited by Aron Chen</p>
            </div>
        </div>
    )

}

export default Homepage