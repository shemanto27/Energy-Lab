import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';



import SolarModeling from './components/SolarModeling';
import Home from './Pages/Home';

const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/solar-PV', element: <SolarModeling />},
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
