import React from 'react'
import laptop from '../assets/images/laptop.webp';
import love from '../assets/images/love.webp'

function Footer() {
  return (
    <div>
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
    </div>
  )
}

export default Footer
