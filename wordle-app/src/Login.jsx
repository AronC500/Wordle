import "./Login.css"
import {useState} from 'react'
import { useNavigate, useLocation} from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'

function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const [message, setShowMessage] = useState('')
    const email = location.state?.email || ''
    const googleLogin =  useGoogleLogin({
        onSuccess: async (response) => {
            const user = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${response.access_token}`
                },
            })
            const data = await user.json()
            const databaseresponse = await fetch("https://wordle-production-4ba9.up.railway.app/login", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: data.email,
                    password: '',
                    google: true
                })
            })
            const userData = await databaseresponse.json()
            if (databaseresponse.ok) {
                localStorage.setItem('user', JSON.stringify(userData))
                navigate('/game')
            }
            else {
                console.log(userData.error)
            }
        },
        onError: () => {
            console.log("Google Login failed")
        }
    })  
    const [input, setInput] = useState(email)
    const [isInvalid, setIsInvalid] = useState(false)
    async function submitEmail() {
        if (!input.includes('@gmail.com') || input.split('@')[0].length === 0) {   
            setShowMessage('Please enter a valid email address.')         
            setIsInvalid(true)
            return
        }
        else {        
            setIsInvalid(false)
        }
        const response = await fetch(`https://wordle-production-4ba9.up.railway.app/login/${encodeURIComponent(input)}`, {
            method: 'GET'
        })

        if (response.status === 404) {
            navigate('/login/createFree', {state: {email:input}})
            return
        }

        const data = await response.json()
        if (response.ok) {
            if (data?.google) {
                setIsInvalid(true)
                setShowMessage('This email previously logged in using Google.')
                return;
            }
            
            
            navigate('/login/password', {state: {email:input}})
            

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
                            <div>{message}</div>
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