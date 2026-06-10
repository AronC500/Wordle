import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Homepage from "./Homepage.jsx"
import Login from "./Login.jsx"
import { BrowserRouter, Routes, Route} from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/game" element={<App/>}/>
        <Route path="/login" element={<Login/>}/>

      </Routes>
    </BrowserRouter>
)
