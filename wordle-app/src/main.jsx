import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Homepage from "./Homepage.jsx"
import Login from "./Login.jsx"
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Password from "./password.jsx"
import ForgotPassword from "./forgotpassword.jsx"
import CreateFree from "./CreateFreeAccount.jsx"
import SetNewPassword from "./SetNewPassword.jsx"
import UpdatedPass from "./UpdatedPass.jsx"
import DeleteAccount from "./deleteAccount.jsx"

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLECLIENTID}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/game" element={<App/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/login/password" element={<Password/>}/>
        <Route path="/login/password/forgot" element={<ForgotPassword/>}/>
        <Route path="/login/createFree" element={<CreateFree/>}/>
        <Route path="/login/password/SetNewPassword" element={<SetNewPassword/>}/>
        <Route path="/login/password/SetNewPassword/UpdatedPass" element={<UpdatedPass/>}/>
        <Route path="/deleteAccount" element={<DeleteAccount/>}/>
      </Routes>
    </BrowserRouter>
  </GoogleOAuthProvider>
)
