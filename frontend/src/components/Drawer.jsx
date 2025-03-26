import React from 'react';

function Drawer({ options, onSelect }) {
  return (
    <div className="w-64 bg-gray-200 p-4">
      <ul>
        {options.map((option) => (
          <li key={option.path} className="mb-2">
            <button className="btn btn-block" onClick={() => onSelect(option.path)}>
              {option.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Drawer;