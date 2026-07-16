import "./UpdatedPass.css"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect } from 'react'
function UpdatedPass() {
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
            return
        }
    }, [])

    function continueButton() {
        navigate('/game')
    }

    return (
        <div>
            <div className="UpdatedPassText">
                <div className="headingtext">
                    <div className="loginupdated">Your login has been updated</div>
                    <div className="passwordsavedtext"> Your new password has been saved and you've been logged in.
                    </div>
                </div>
                <div className="submit">
                    <button onClick={continueButton} className="submitbutton">Continue</button>
                </div>

            </div>
        </div>
    )
}

export default UpdatedPass
