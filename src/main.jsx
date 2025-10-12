import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import App from './App.jsx'
import { Authaprovider } from './components/context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

  <BrowserRouter>
  <Authaprovider>

  <App />
  </Authaprovider>
  </BrowserRouter>
  </StrictMode>
    
  
)
