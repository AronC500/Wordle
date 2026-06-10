import "./Login.css"

function Login() {
    return (
        <div className="loginbackground">
            <div className="LoginText">
                Log in or create an account
            </div>
            <div className="forms">
                <div className="email">
                    <div className="emailtext">Email address</div>
                    <input type="email"/>
                </div>
                <button className="continuebutton">Continue</button>
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
                        <img style={{width:'23px', height:'23px'}} src="apple.png"/>
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