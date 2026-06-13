import "./CreateFreeAccount.css"
import {useLocation, useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
function CreateFree() {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email
    const [passText, setPassText] = useState('Show')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)
    const [isInvalidPass, setisInvalidPass] = useState(false)

    useEffect(() => {
        if (!email) {
            navigate('/login')
        }
    }, [])

    function checkPassword() {
        if (password.length < 6) {
            setisInvalidPass(true)
            return
        }
        navigate('/game')

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

    function InputChange(e) {
        setPassword(e.target.value)
        setisInvalidPass(false)
    }
    return (
        <div className="CreateFree">
            <div className="headertext">
                <div className="createtext">Create your free account</div>
            </div>
            <div className="inputs">
                <div className="email" style={{margin:"0px", padding:"0px"}}>
                    <div>Email address</div>
                    <input value={email} disabled type="email" />
                    <button  className="pEmailEdit">Edit</button>
                </div>
                <div className="password">

                    <div>Password</div>
                    <input className= {isInvalidPass ? 'inputInvalid': 'inputNormal'} type={show ? 'text' : 'password'} onChange = {InputChange}/>
                    <button onClick = {showText} className="pPasswordEdit">{passText}</button>
                    {isInvalidPass && 
                    <div className="setnewpassworderror">
                        <img src="/error.png" style={{width:"13px",height:"13px", paddingTop:"1.5px"}}/>
                        <div>This password must be at least six characters long.</div>
                    </div>}
                </div>
            </div>

            <div className="submit" style={{gap:"20px"}}>
                <div className="termstext" style={{textAlign:"start", fontSize:"13.5px"}}> 
                    By creating an account, you agree to the <a>Terms of Sale</a>, <a>Terms of Service</a>, and <a>Privacy Policy</a>.
                </div>
                <button onClick={checkPassword}  className="submitbutton">Create account</button>
            </div>
        </div>
    )

}

export default CreateFree;