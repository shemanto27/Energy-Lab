import React from 'react'
import { TiThMenu } from "react-icons/ti";
import SolarModeling from './SolarModeling';
import { FaInfoCircle } from "react-icons/fa";


function Navbar() {
return (
    <>
        <div className="navbar bg-base-100 shadow-sm mb-5">
            <label htmlFor="my-drawer" className="btn btn-primary drawer-button mr-2"><TiThMenu /></label>
            <a className="btn btn-ghost text-xl">Energy Lab: Solar</a>
            <sup className='text-rose-600 flex justify-center items-center text-sm gap-1 btn' onClick={()=>document.getElementById('my_modal_3').showModal()}><FaInfoCircle />Beta Version</sup>

            <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
                <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <p className="py-4">This version of the software is available only for testing and showcasing purpose to gather user feedback. Many of functionalities may not work properly, wait till stable version release</p>
            </div>
            </dialog>
            
        </div>

        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Page content here */}
                <SolarModeling />
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li><a>I-V Modeling</a></li>
                    <li><a>Shading</a></li>
                    <li><a>Soiling</a></li>
                    <li><a>Solar Tracking</a></li>
                    <li><a>Floating PV Systems Modelling</a></li>
                </ul>
            </div>
        </div>
    </>
)
}

export default Navbar
