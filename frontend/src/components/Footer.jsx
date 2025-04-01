import React from 'react'

function Footer() {
  return (
    <div>
      <footer className="footer sm:footer-horizontal footer-center bg-[#111828] text-base-content p-4 border-t-3 border-white">
        <aside>
          <p className='text-white flex items-center justify-center flex-wrap'>
            Copyright © {new Date().getFullYear()} - Build by 
            <span className='mx-2'><a href="https://www.linkedin.com/in/shemanto/" target="_blank" className='italic underline'>Shemanto Sharkar</a></span> 
            with 
            <span className='flex items-center justify-center ml-1'>
              💻 + ☕
            {/* <img src={laptop} alt="laptop" className='w-5 mx-1' /> +  */}
            {/* <img src={love} alt="love" className='w-5 mx-1'/> */}
            </span>
          </p>
        </aside>
      </footer>
    </div>
  )
}

export default Footer
