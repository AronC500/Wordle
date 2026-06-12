import "./forgotpassword.css"

function forgotPassword() {
    return (
        <div className="forgotpasswordbackground">
            <div className="headingtext">
                <div>Welcome back</div>
                <div>We've sent a login code to the email you entered. This code will stay valid for ten minutes.
                </div>
            </div>
            <div className="inputs">
                <div className="email">
                    <div>Email address</div>
                    <input type="email"/>
                </div>
                <div className="verification">
                    <div>Verification code</div>
                    <input/>
                </div>
            </div>
            <div className="buttons">
                <button>Log in</button>
                <button>Use a password instead</button>
            </div>
            <div>Didn't receive a code? Check your spam folder or <a>request a new one.</a></div>
        </div>
    )
}
export default forgotPassword