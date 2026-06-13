import "./Login.css"
import {useState} from 'react'
import { useNavigate, useLocation} from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
//need creaete show and edit button, when going back to login, email is back there still for 
//when you click edit or not click edit by just clicking arrow back button. also that they cant click forget password
//when tehy have no email when we do database part just check eveyrthing when we start database ig.
function Login() {
    const location = useLocation()
    const exampleUserEmailInDatabase = 'aronc220@gmail.com'
    const userEmail = location.state?.email
    const navigate = useNavigate()
    const googleLogin = useGoogleLogin({
        onSuccess: (response) => {
            navigate('/game')
        },
        onError: () => {
        }
    })
    const [input, setInput] = useState(!userEmail ? '' : userEmail)
    const [isInvalid, setIsInvalid] = useState(false)
    function submitEmail() {
        if (!input.includes('@gmail.com')) {
            setIsInvalid(true);
            return;
        }
        setIsInvalid(false)
        if (exampleUserEmailInDatabase === input) {
            navigate('/login/password', {state: {email: input}})
        }
        else {
            navigate('/login/createFree', {state: {email: input}})
        }
    }
    function onChangeInput(e) {
        setInput(e.target.value) 
        setIsInvalid(false)
    }
    return (
        <div className="loginbackground">
            <div className="LoginText">
                Log in or create an account
            </div>
            <div className="forms">
                <div className="email">
                    <div className="emailtext">Email address</div>
                    <input maxLength={64} className= {isInvalid ? 'inputInvalid': 'inputNormal'} value ={input} onChange={onChangeInput} type="email"/>
                    {isInvalid &&
                        <div className="error">
                            <img src='/error.png' style={{width:"13px",height:"13px"}}/>
                            <div>Please enter a valid email address.</div>
                        </div>
                    }
                    
                </div>
                <button onClick = {submitEmail} className="continuebutton">Continue</button>
                <div className="horizontalline">
                    <hr/>
                    <p>or</p>
                    <hr/>
                </div>
                <div className="termstext"> 
                By continuing, you agree to the <a>Terms of Sale</a>, <a>Terms of Service</a>, and <a>Privacy Policy</a>.
                </div>
                <div className="alternateOptions">
                    <button className="google" onClick={() => googleLogin()}>
                        <img style={{width:'18px', height:'18px'}} src="google.png"/>
                        <div>
                            Continue with Google
                        </div>
                    </button>
                    <button className="apple">
                        <img style={{width:'23px', height:'23px', }} src="apple.png"/>
                        <div>
                            Continue with Apple
                        </div>
                    </button>

                </div>
            </div>
        </div>
    )

}

export default Login