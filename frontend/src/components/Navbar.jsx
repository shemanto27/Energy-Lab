import React from 'react';
import { TiThMenu } from "react-icons/ti";
import { FaInfoCircle } from "react-icons/fa";

function Navbar({ onSelectAnalysis }) {
    return (
        <>
            <div className="navbar bg-base-100 shadow-sm mb-5">
                <label htmlFor="my-drawer" className="btn btn-primary drawer-button mr-2"><TiThMenu /></label>
                <a className="btn btn-ghost text-xl">Energy Lab: Solar</a>
                <sup className='text-rose-600 flex justify-center items-center text-sm gap-1 btn' onClick={() => document.getElementById('my_modal_3').showModal()}><FaInfoCircle />Beta Version</sup>

                <dialog id="my_modal_3" className="modal">
                    <div className="modal-box">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <p className="py-4">This version of the software is available only for testing and showcasing purpose to gather user feedback. Many functionalities may not work properly, wait till stable version release</p>
                    </div>
                </dialog>
            </div>
        </>
    );
}

export default Navbar;