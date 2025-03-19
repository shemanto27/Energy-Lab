import React from 'react'
import { TiThMenu } from "react-icons/ti";
import IVModeling from './IV-Modeling';


function Navbar() {
return (
    <>
        <div className="navbar bg-base-100 shadow-sm mb-5">
            <label htmlFor="my-drawer" className="btn btn-primary drawer-button mr-2"><TiThMenu /></label>
            <a className="btn btn-ghost text-xl">Energy Lab: Solar</a>
        </div>

        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Page content here */}
                <IVModeling />
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
