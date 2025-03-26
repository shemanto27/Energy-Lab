import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Drawer from '../components/Drawer';

function SolarLayout() {
  const navigate = useNavigate();

  const drawerOptions = [
    { name: 'PV Power', path: '/solar' },
    { name: 'IV Modeling', path: '/solar/iv-modeling' },
    { name: 'Shading Analysis', path: '/solar/shading' },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Drawer options={drawerOptions} onSelect={(path) => navigate(path)} />
        <main className="flex-grow p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default SolarLayout;