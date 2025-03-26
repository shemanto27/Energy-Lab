import React from 'react';
function Drawer({ options, onSelect }) {
  return (
    <div className="drawer w-0">
      <input id="my-drawer" type="checkbox" className="drawer-toggle hidden" />
     
      <div className="drawer-side fixed top-0 left-0 z-50 ">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 gap-2">
          {options.map((option) => (
            <li key={option.path}>
              <button className="btn btn-block drawer-button" onClick={() => onSelect(option.path)}>
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Drawer;