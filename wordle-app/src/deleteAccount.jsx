import './deleteAccount.css'
import {useLocation, useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
function DeleteAccount() {
    const location = useLocation()
    const email = location.state?.email
    const navigate = useNavigate()
    const maxWords = 400
    const [text, setText] = useState('')
    const [confirm, setConfirm] = useState(false)
    const [deleted, setDeleted] = useState(false)

    useEffect(()=> {
        if (!email) {
            navigate('/login')

        }
    }, [])
    function textChange(e) {
        setText(e.target.value)
    }
    async function deleteAccount() {
        const response = await fetch('http://localhost:3000/deleteAccount', {
            method:"DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email})
        })
        const data = await response.json()
        if (!response.ok) {
            console.log(data.error)
            return
        }
        setDeleted(true)
        localStorage.removeItem('user')
    }

    return (
        <div className="fullcontainer">
        {!deleted ? 
        <div className="innercontainer">
            <div className="delete">
                Delete your account
            </div>
            <div className="permanent">
                <div style={{fontWeight:'bold'}}>Delete the New York Times account for: </div>
                <div>{email}</div>
            </div>
            <div className="permanent">
                You will permanently lose access to all history associated with this account. You will no longer be able to use features that require a Aron Times account.
            </div>
            <div className="permanent">
                This cannot be undone.
            </div>
            <div>
                <div className="permanent" style={{fontWeight:'bold'}}>
                    What to expect
                </div>
                <div className="permanent">
                After your account has been deleted, you will no longer be able to log in to Aron
                Times products using this account, including News, Games, Cooking, 
                Wirecutter and The Athletic. You will also stop receiving marketing 
                emails and newsletters to the email address associated with this account.                
                </div>
            </div>
            <div className="textareaSection">
                <div className="permanent" style={{paddingBottom:'10px'}}>Tell us why you are deleting your account. (optional)</div>
                <textarea maxLength={maxWords}  onChange={(e) => textChange(e)} style={{marginBottom:'5px'}}></textarea>
                <div className="characters">{maxWords - text.length} characters left </div>
            </div>
            <div className="checkboxSection">
                <input type='checkbox' onClick={()=> setConfirm(!confirm)}>
                </input>
                <div className="permanent">
                    I confirm I want to delete my Aron Times account.
                </div>
            </div>
            <div className="deleteSection">
                <button className={confirm ? 'normalButton' : 'disableButton' } onClick={deleteAccount}>Delete account</button>
                <a href='/game' className="permanent">Return to Wordle</a>
            </div>

        </div>
        :
            <div className="deleteContainer">
                <div className="delete"> Your Aron Times account is being deleted.</div>
                <div className="permanent"> We are deleting the New York Times account for <strong>{email}.</strong></div>
                <div className="permanent">
                This action may take a few minutes. You will be logged out immediately and on all other devices.
                </div>
                <div className="permanent">
                    No further action is needed. You may close this window.
                </div>
            </div>
                
        }
       

        </div>
    )
}

export default DeleteAccount