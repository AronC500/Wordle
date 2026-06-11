import "./Login.css"
import {useState} from 'react'
function Login() {
    const [input, setInput] = useState('')
    const [isInvalid, setIsInvalid] = useState(false)
    function submitEmail() {
        if (!input.includes('@gmail.com')) {
            setIsInvalid(true);
            return;
        }
        setIsInvalid(false)
        setInput('')
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
                    <input className= {isInvalid ? 'inputInvalid': 'inputNormal'} value ={input} onChange={onChangeInput} type="email"/>
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
                    <button className="google">
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