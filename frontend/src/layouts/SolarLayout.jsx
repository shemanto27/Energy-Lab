import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Drawer from '../components/Drawer';

function SolarLayout() {
  const navigate = useNavigate();

  const drawerOptions = [
    { name: 'PV Power', path: '/solar-pv' },
    { name: 'IV Modeling', path: '/solar-pv/iv-modeling-sdm' },
    { name: 'Shading Analysis', path: '/solar-pv/shading' },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Drawer options={drawerOptions} onSelect={(path) => navigate(path)} />
        <main className="drawer-content justify-center items-center flex-grow">
          <Outlet/>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default SolarLayout;