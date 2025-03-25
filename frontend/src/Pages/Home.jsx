import React from 'react';
import logo from '../assets/images/logo.png';
import solar_wind from '../assets/images/solar-wind.jpg';
import { FaSolarPanel } from "react-icons/fa6";
import { GiWindTurbine } from "react-icons/gi";
import { FaWater } from "react-icons/fa";
import laptop from '../assets/images/laptop.webp';
import love from '../assets/images/love.webp'
import { MdHeatPump } from "react-icons/md";
import open_source_logo from '../assets/images/open-source-logo.webp';

import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();

  return (
    <>
    {/* Navbar */}
        <section>
    <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1 items-center justify-center">
            <a className="btn btn-ghost text-3xl font-bold text-[#00A86B]"><img src={logo} alt="energylab logo" className='w-13' />EnergyLab</a>
        </div>
        <div className="flex-none">
            <ul className="menu menu-horizontal px-1 flex justify-center items-center font-bold text-[#151f2d]">
            <li><a>Simulators</a></li>
            <li><a>About</a></li>
            <li><a>Contact</a></li>
            <li>
                <details>
                <summary className='btn bg-[#00A86B] text-white'>Start Simulation</summary>
                <ul className="bg-base-100 rounded-t-none p-2">
                    <li><a href='/solar-pv'>Solar PV</a></li>
                    <li><a>Link 2</a></li>
                </ul>
                </details>
            </li>
            <li><a href="https://github.com/shemanto27/Energy-Lab" target="_blank" rel="noopener noreferrer"><img className='w-40' src={open_source_logo} alt="" /></a></li>
            </ul>
        </div>
        </div>
        </section>

    {/* Hero Section */}
        <section>
        <div className="hero bg-white my-5">
        <div className="hero-content flex-col lg:flex-row-reverse">
            <img
            src={solar_wind}
            alt="solar wind"
            className="max-w-sm rounded-lg shadow-2xl" />
            <div>
            <h1 className="text-5xl font-bold text-[#111828]">Simulate Energy System with Precision</h1>
            <p className="py-6 text-[#111828]">
                Detailed analysis of energy systems to help you make informed decisions.Calculate the energy output of your solar panels, wind turbines, and more based on your location, weather, and system configuration.
            </p>
            <button className='btn bg-[#00A86B] text-white mr-3'>Start Simulation</button>
            <button className='btn bg-white text-[#00A86B] border-[#00A86B]'>Explore Simulation</button>
            </div>
        </div>
        </div>
        </section>


    {/* Card Section  */}
        <section className='bg-base-200 flex flex-wrap justify-center items-center gap-2 py-10'>
        {/* solar card */}
        <div className="card w-96 bg-base-100 card-xs shadow-sm border-2 border-white hover:border-[#00A86B] hover:text-[#00A86B] cursor-pointer">
        <div className="card-body">
            <FaSolarPanel className='text-5xl'/>
            <h2 className="card-title text-xl">Solar Photo Voltic</h2>
            <p className='text-sm'>Solar photovoltaic (PV) technology, often shortened to PV, is a method of harnessing solar energy and converting it directly into electricity. </p>
        </div>
        </div>

        {/* wind card */}
        <div className="card w-96 bg-base-100 card-xs shadow-sm border-2 border-white hover:border-[#00A86B] hover:text-[#00A86B] cursor-pointer">
        <div className="card-body">
            <GiWindTurbine className='text-5xl'/>
            <h2 className="card-title text-xl">Wind Turbine</h2>
            <p className='text-sm'>A wind turbine is a device that converts the kinetic energy of wind into electricity, using blades to capture the wind's energy and turn a rotor connected to a generator.</p>
        </div>
        </div>

        {/* hydro card */}
        <div className="card w-96 bg-base-100 card-xs shadow-sm border-2 border-white hover:border-[#00A86B] hover:text-[#00A86B] cursor-pointer">
        <div className="card-body">
            <FaWater className='text-5xl'/>
            <h2 className="card-title text-xl">Hydropower Plant</h2>
            <p className='text-sm'>At hydropower plants water flows through a pipe then pushes against and turns blades in a turbine that spin to power a generator to produce electricity.</p>
        </div>
        </div>

        {/* Heat Pump Card  */}
        <div className="card w-96 bg-base-100 card-xs shadow-sm border-2 border-white hover:border-[#00A86B] hover:text-[#00A86B] cursor-pointer">
        <div className="card-body">
            <MdHeatPump className='text-5xl'/>
            <h2 className="card-title text-xl">Heat Pump</h2>
            <p className='text-sm'>A heat pump is a device that uses electricity to transfer heat, rather than generate it, making it an energy-efficient alternative to traditional heating and cooling systems.</p>
        </div>
        </div>
        </section>


    {/* Footer Section  */}
    <section>
    <footer className="footer sm:footer-horizontal bg-[#111828] text-neutral-content p-10">
    <aside>
    <div className='flex items-center justify-center gap-2'>
    <img src={logo} alt="open source" className='w-15' />
    <h1 className='text-3xl font-bold'>EnergyLab</h1>
    </div>
    <p>
      Developed by Bidut Sharkar Shemanto
      <br />
      we are fully open-source
    </p>
  </aside>
  <nav>
    <h6 className="footer-title">Services</h6>
    <a className="link link-hover">Branding</a>
    <a className="link link-hover">Design</a>
    <a className="link link-hover">Marketing</a>
    <a className="link link-hover">Advertisement</a>
  </nav>
  <nav>
    <h6 className="footer-title">Company</h6>
    <a className="link link-hover">About us</a>
    <a className="link link-hover">Contact</a>
    <a className="link link-hover">Jobs</a>
    <a className="link link-hover">Press kit</a>
  </nav>
  <nav>
    <h6 className="footer-title">Legal</h6>
    <a className="link link-hover">Terms of use</a>
    <a className="link link-hover">Privacy policy</a>
    <a className="link link-hover">Cookie policy</a>
  </nav>
</footer>

    <footer className="footer sm:footer-horizontal footer-center bg-[#111828] text-base-content p-4 border-t-3 border-white">
        <aside>
          <p className='text-white flex items-center justify-center flex-wrap'>
            Copyright © {new Date().getFullYear()} - Build by Shemanto Sharkar with 
            <span className='flex items-center justify-center'>
            <img src={laptop} alt="laptop" className='w-5 mx-1' /> + 
            <img src={love} alt="love" className='w-5 mx-1'/>
            </span>
          </p>
        </aside>
      </footer>
    </section>

    </>
  )
}

export default Home
