import "./UpdatedPass.css"
import {useNavigate, useLocation} from "react-router-dom"
import {useEffect} from 'react'
function UpdatedPass() {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email
    useEffect(() => {
        if (!email) {
            navigate('/login')
        }
    }, [])
    return (
        <div>
            <div className="UpdatedPassText">
            <div className="headingtext">
                <div className="loginupdated">Your login has been updated</div>
                <div className="passwordsavedtext"> Your new password has been saved and you've been logged in.
                </div>
            </div>
            <div className="submit">
                <button onClick={()=> navigate('/game')} className="submitbutton">Continue</button>
            </div>
            
        </div>
        </div>
    )
}

export default UpdatedPass