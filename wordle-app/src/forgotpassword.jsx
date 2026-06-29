import "./forgotpassword.css"
import {useLocation, useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
function ForgotPassword() {
    const navigate = useNavigate()
    const testcode = '234567'
    const location = useLocation()
    const email = location.state?.email
    const [input, setInput] = useState('')
    const [showPopUp, setShowPopUp] = useState(false)
    const [invalidCode, SetinvalidCode] = useState(false)
    const [verificationCode, setVerificationcode] = useState('')
    const [verificationExpire, setVerificationExpire] = useState('')

    async function sendVerificationCode() {
        const response = await fetch('http://localhost:3000/verification', {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email})
        })
        const data = await response.json()
        if (response.status === 404) {
            console.log(response.error)
            return
        }
        if (data?.verificationCode) {
            setVerificationcode(data.verificationCode)
            setVerificationExpire(data.expiresAt)
        }
    }
    useEffect(() => {
        if (!email) {
            navigate('/login')
            return
        }
        sendVerificationCode()
       
    }, [])

    function checkInputs(e) {
        SetinvalidCode(false)
        if (isNaN(Number(e.target.value))) {
            return
        }
        if (e.key === 'Backspace') {
            setInput(e.target.value)
            return
        }
        setInput(e.target.value) 
    }

    function requestCode() {
        setShowPopUp(true)
        sendVerificationCode();

    }
    function submitCode() {
        const isNotExpired = new Date(verificationExpire) > new Date();
        const isValid = verificationCode === input && isNotExpired;

        if (isValid) {
            navigate("/login/password/SetNewPassword", {
                state: { email }
            });
            return;
        }
        SetinvalidCode(true);
    }

    return (
        <div className="forgotpasswordbackground">
            <div className="headingtext">
                <div className="checkemail">Check your email to reset your password</div>
                <div className="codetext"> Enter the code we sent to <span style={{fontWeight:600}}>{email}</span>  to update your login. This code expires in 10 minutes.
                </div>
            </div>
            <div className="verificationcode">
                    <div>Verification code</div>
                    <input className= {invalidCode ? "verificationinputinvalid" : "verificationinput"} maxLength={6} value = {input} onChange={checkInputs}/>
                    {invalidCode &&
                    <div className="codeerror">
                        <img src="/error.png" style={{width:"13px",height:"13px"}}/>
                        <div>The code you entered is incomplete. Please check your email and try again.</div>
                    </div>
                
                    }
                    
            </div>
            <div className="submit">
                <button onClick={submitCode} className="submitbutton">Submit</button>
            </div>
            <div className="bottomtext">Didn't receive a code? Check your spam folder or <a onClick={requestCode}>request a new one.</a></div>
            {showPopUp &&
            <div className="popup">
                <img style={{width:"23px",height:"23px"}} src="/check.png"/>
                <span style={{marginRight:"70px", marginLeft:"15px"}}>We've sent another code to {email}</span>
                <button onClick={()=>setShowPopUp(false)} style={{all:"unset", cursor:"pointer"}}> 
                    <img style={{width:"13px",height:"13px"}} src="/blackx.png"/>
                </button>
            </div>
            }
        </div>
    )
}
export default ForgotPassword