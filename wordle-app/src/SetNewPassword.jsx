import "./SetNewPassword.css"
import {useLocation, useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
function NewPassword() {
    const location = useLocation()
    const navigate = useNavigate()
    const email = location.state?.email
    const [passText, setPassText] = useState('Show')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)
    const [errorMessage, setErrorMessage]  = useState('')
    const [isInvalid, setisInvalid] = useState(false)

    useEffect(() => {
        if (!email) {
            navigate('/login')

        }
    }, [])

    function showText() {
        setShow(!show)
        if (!show) {
            setPassText('Hide')
        }
        else {
            setPassText('Show')
        }

    }

    async function checkPassword() {
        const response = await fetch('https://wordle-production-4ba9.up.railway.app/login', {
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({password,email})
         })
        const data = await response.json()
        if (response.status === 500) {
            console.log(data.error) 
            return
        }
        if (response.status === 200) {
            console.log(data.error)
            setErrorMessage("Your new password must be different than your previous password.")
            setisInvalid(true)
            return

        }
        else if (password.length < 6) {
            setErrorMessage("This password must be at least six characters long.")
            setisInvalid(true)
        }
        else {
            const response = await fetch('https://wordle-production-4ba9.up.railway.app/newPassword', {
                method:"PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({password,email})
            })
            const data = await response.json()
            if (response.status === 500) {
                console.log(data.error) 
                return
            }
            if (response.ok) {
                navigate('/login/password/SetNewPassword/UpdatedPass', {state: {email: email}})
            }

        }
    }
    function InputChange(e) {
        setPassword(e.target.value)
        setErrorMessage('')
        setisInvalid(false)
    }
    return (
        <div className="SetNewPasswordBackground">
            <div className="headingtext">
                <div className="setnewpassword">Set a new password</div>
                <div className="newpasswordtext"> Your email <span style={{fontWeight:600}}>{email}</span> has been verified. Please set a new password, and we'll log you in.
                </div>
            </div>
            <div className="password" style={{marginTop:"16px"}}>
                    <div>Password</div>
                    <input     maxLength={255} className= {isInvalid ? 'inputInvalid': 'inputNormal'} type={show ? 'text' : 'password'} onChange = {InputChange}/>
                    <button onClick = {showText} className="pPasswordEdit">{passText}</button>

            </div>
            {isInvalid &&
                <div className="setnewpassworderror">
                    <img src="/error.png" style={{width:"13px",height:"13px", paddingTop:"1.5px"}}/>
                    <div>{errorMessage}</div>
                </div>
                
                }

            <div className="submit" style={{marginTop:"16px"}}>
                <button onClick={checkPassword} className="submitbutton">Set password</button>
            </div>
            
        </div>
    )
}

export default NewPassword