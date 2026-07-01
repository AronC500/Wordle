import "./UpdatedPass.css"
import {useNavigate, useLocation} from "react-router-dom"
import {useEffect} from 'react'
function UpdatedPass() {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email
    navigate('/login')

    useEffect(() => {
        if (!email) {
        }
    }, [])
    async function continueButton() {
        const response = await fetch(`http://localhost:3000/login/${encodeURIComponent(email)}`, {
            method: 'GET'
        })

        if (response.status === 404 || response.status === 500) {
            console.log(response.error)
            return
        }

        const data = await response.json()
        if (response.ok) {     
            localStorage.setItem('user', JSON.stringify(data))
            navigate('/game')
        }


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