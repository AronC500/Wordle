import "./password.css"
import {useNavigate, useLocation} from 'react-router-dom'
import {useState, useEffect} from 'react'

function Password() {
    const testEmail = 'gg@gmail.com'
    const testpassword = '623456150'
    const location = useLocation()
    const email =  location.state?.email || ''
    const [passText, setPassText] = useState('Show')
    const [show, setShow] = useState(false)
    const [password, setPassword] = useState('')
    const [isInvalid, setisInvalid] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        if (!email) {
            navigate('/login')
        }
    }, [])
    function LogIn() {
        if (password === testpassword && testEmail === email) {
            setisInvalid(false)
            navigate('/game')
            return
        }
        setisInvalid(true)
    }
    function showText() {
        setShow(!show)
        if (!show) {
            setPassText('Hide')
        }
        else {
            setPassText('Show')
        }

    }

    function editEmail() {
        navigate('/login', {state: {email}})

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
                    <input disabled type="email" value={email}/>
                    <button onClick={editEmail} className="pEmailEdit">Edit</button>
                </div>
                <div className="password">
                    <div>Password</div>
                    <input maxLength={255} type={show ? 'text' : 'password'} onChange = {(e) => setPassword(e.target.value)}/>
                    <button onClick = {showText} className="pPasswordEdit">{passText}</button>
                </div>
                <a onClick={()=> navigate('/login/password/forgot', {state: {email}})} className="forgot">Forgot your password?</a>
            </div>
            {isInvalid && <div className="errormessage">The email address or password you entered is incorrect. Please try again. </div>}
            <div className="buttons">
                <button onClick = {LogIn} className="loginPass">Log in</button>
                <button className="code">Email me a one-time code</button>
            </div>
            </div>
        </div>
    )
}

export default Password