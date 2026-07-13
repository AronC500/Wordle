import "./Homepage.css"
import { useNavigate } from 'react-router-dom'


function returnDate() {
    const today = new Date()

    let month
    switch (today.getMonth()) {
        case 0:
            month = 'January';
            break
        case 1:
            month = 'February';
            break
        case 2:
            month = 'March';
            break
        case 3:
            month = 'April';
            break
        case 4:
            month = 'May';
            break
        case 5:
            month = 'June';
            break
        case 6:
            month = 'July';
            break
        case 7:
            month = 'August';
            break
        case 8:
            month = 'September';
            break
        case 9:
            month = 'October';
            break
        case 10:
            month = 'November';
            break
        case 11:
            month = 'December';
            break

    }
    return `${month} ${today.getDate()}, ${today.getFullYear()}`

}
function Homepage() {
    const user = JSON.parse(localStorage.getItem('user'))
    const startDate = new Date(2021, 5, 19)
    const today = new Date()
    const daysDifference = Math.floor((today - startDate) / (1000 * 60 * 60 * 24))
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
                {!user &&
                    <button className="login" onClick={() => { navigate('/login') }}>Log in</button>
                }
                <button className="play" onClick={() => { navigate('/game') }}>Play</button>
            </div>
            <div className="bottomtext">
                <p className="date">{returnDate()}</p>
                <p className="rest">No. {daysDifference}</p>
                <p className="rest">Edited by Aron Chen</p>
            </div>
        </div>
    )

}

export default Homepage