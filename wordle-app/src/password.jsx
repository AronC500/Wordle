import "./password.css"
import {useNavigate, useLocation} from 'react-router-dom'
import {useState, useEffect} from 'react'

function Password() {

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



    async function LogIn() {
        const response = await fetch(`http://localhost:3000/login`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email,password})
        })

        const data = await response.json()
        if (response.status=== 500 || response.status === 404) {
            console.log(data.error)
            return
        }
        if (response.status === 401) {
            console.log(data.error)
            setisInvalid(true)
            return

        }
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data))
            setisInvalid(false)
            navigate('/game')
            return
        }
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
                <a onClick={()=> navigate('/login/password/forgot', {state: {email, sendCode: true}})} className="forgot">Forgot your password?</a>
            </div>
            {isInvalid && <div className="errormessage">The password you entered is incorrect. Please try again. </div>}
            <div className="buttons" style={{marginTop:"10px"}}>
                <button onClick = {LogIn} className="loginPass">Log in</button>
            </div>
            </div>
        </div>
    )
}

export default Password