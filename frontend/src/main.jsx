import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Solar from './components/IV-Modeling'
import Navbar from './components/Navbar';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    
  </StrictMode>,
)
