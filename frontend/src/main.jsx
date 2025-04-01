import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


import Home from './Pages/Home';
import SolarLayout from './layouts/SolarLayout';
import PVPower from './Pages/Solar/PVPower';
import IVModelingSDM from './Pages/Solar/IVModelingSDM';
import Shading from './Pages/Solar/Shading';


import WindLayout from './layouts/WindLayout';
import WindTurbine from './Pages/Wind/WindTurbine';
import WindFarm from './Pages/Wind/WindFarm';




const router = createBrowserRouter([
  // Home Page
  {path: '/', element: <Home />},

  // Solar Pages
  {
    path: '/solar-pv', 
    element: <SolarLayout />,
    children: [
    { index:true, element: <PVPower /> }, // Default route
    {path: 'iv-modeling-sdm', element: <IVModelingSDM />},
    {path: 'shading', element: <Shading />}, 
  ],
  },

// Wind Pages
  {
    path: '/wind-turbine',
    element: <WindLayout />,
    children: [
    { index:true, element: <WindTurbine /> }, // Default route
    {path: 'wind-farm', element: <WindFarm />},
    ],
  },


])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
