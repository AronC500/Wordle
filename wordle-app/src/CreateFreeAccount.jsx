import "./CreateFreeAccount.css"
import {useLocation} from 'react-router-dom'
function CreateFree() {
    const location = useLocation()
    return (
        <div>
            <div>Create your free account</div>
            <div>
                <div>Email address</div>
                <input/>
            </div>
            <div>
                <div>Password</div>
                <input/>
            </div>
            <div>
                <div>By creating an account, you agree to the <a>Terms of Sale</a>, <a>Terms of Service</a>, and <a>Privacy Policy</a>.</div>
                <button>Create account</button>
            </div>

        </div>
    )

}

export default CreateFree;