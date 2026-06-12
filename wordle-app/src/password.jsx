import "./password.css"
import {useLocation, useNavigate} from 'react-router-dom'
import {useState} from 'react'

function Password() {
    const testEmail = 'gg@gmail.com'
    const testpassword = '623456150'
    const location = useLocation()
    const userEmail = location.state?.email
    const [password, setPassword] = useState('')
    const [isInvalid, setisInvalid] = useState(false)
    const navigate = useNavigate()
    function LogIn() {
        if (password === testpassword && testEmail === userEmail) {
            setisInvalid(false)
            navigate('/game')
            return
        }
        setisInvalid(true)



    }
    return (
        <div className="passwordbackground">
            <div className="inner">
            <div className="headertext">
                <div className="welcome">Welcome back</div>
                <div className="enterpass">Enter your password to log in.</div>
            </div>
            <div className="inputs">
                <div className="email">
                    <div>Email address</div>
                    <input disabled type="email" value={userEmail}/>
                </div>
                <div className="password">
                    <div>Password</div>
                    <input type="password" onChange = {(e) => setPassword(e.target.value)}/>
                </div>
                <a className="forgot">Forgot your password?</a>
            </div>
            {isInvalid && <div className="errormessage">The email address or password you entered is incorrect. Please try again.</div>}
            <div className="buttons">
                <button onClick = {LogIn} className="loginPass">Log in</button>
                <button className="code">Email me a one-time code</button>
            </div>
            </div>
        </div>
    )
}

export default Password