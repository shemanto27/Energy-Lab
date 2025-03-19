import React from 'react'

function IVModeling() {
  return (
    <div className='flex flex-row justify-between'>
      {/* Left Side Section */}
      <section>
        <div className="card w-96 bg-base-100 shadow-sm">
          <div className="card-body">
            {/* -----------------Location Parameters------------------ */}
            <h3 className='text-3xl font-bold'>Location Parameters</h3>
            <fieldset className="fieldset flex flex-row">
              <div>
                <legend className="fieldset-legend">Latitude</legend>
                <input type="text" className="input" placeholder="Latitude" />
                
                <legend className="fieldset-legend">Altitude</legend>
                <input type="text" className="input" placeholder="Altitude" />
                
                <legend className="fieldset-legend">Timezone</legend>
                <select defaultValue="Server location" className="select select-neutral">
                  <option disabled={true}>Timezone</option>
                  <option>North America</option>
                  <option>EU west</option>
                  <option>South East Asia</option>
                </select>
              </div>
              
              <div>
                <legend className="fieldset-legend">Longitude</legend>
                <input type="text" className="input" placeholder="Longitude" />
              </div>
            </fieldset>
            
            {/* -----------------System Parameters------------------ */}
            <h3 className='text-3xl font-bold'>System Parameters</h3>
            <fieldset className="fieldset flex flex-row">
              <div>
                <legend className="fieldset-legend">Number of Panels</legend>
                <input type="text" className="input" placeholder="Number of Panels" />
                
                <legend className="fieldset-legend">Panel Type</legend>
                <select defaultValue="Server location" className="select select-neutral">
                  <option disabled={true}>Panel Type</option>
                  <option>North America</option>
                  <option>EU west</option>
                  <option>South East Asia</option>
                </select>
              </div>
              
              <div>
                <legend className="fieldset-legend">Panel Efficiency</legend>
                <input type="text" className="input" placeholder="Panel Efficiency" />
                
                <legend className="fieldset-legend">Panel Area</legend>
                <input type="text" className="input" placeholder="Panel Area" />
              </div>
            </fieldset>


            <h3>Tilt Angle</h3>
            <input type="range" min={0} max="90" value="90" className="range text-blue-300 [--range-bg:gray] [--range-thumb:blue] [--range-fill:0]" />

            <h3>Azimuth Angle</h3>
            <input type="range" min={0} max="90" value="90" className="range text-blue-300 [--range-bg:gray] [--range-thumb:blue] [--range-fill:0]" />


            <h3>Weather Condition</h3>
            <div className="join">
              <input className="join-item btn" type="radio" name="options" aria-label="Sunny" />
              <input className="join-item btn" type="radio" name="options" aria-label="Cloudy" />
              <input className="join-item btn" type="radio" name="options" aria-label="Rainy" />
            </div>

            <button className="btn btn-success text-white">Run Simulation</button>
          </div>
        </div>
      </section>

      {/* Middle Section */}
      <section>
        <div className="card w-96 bg-base-100 shadow-sm">
          <div className="card-body">
            {/* Add content for the middle section here */}
          </div>
        </div>
      </section>

      {/* Right Side Section */}
      <section>
      <div className="card w-96 bg-base-100 shadow-sm">
          <div className="card-body">
            {/* -----------------Simultion Conditions------------------ */}
            <h3 className='text-3xl font-bold'>Simultion Conditions</h3>
            <fieldset className="fieldset flex flex-row">  
              
              <div>
                <legend className="fieldset-legend">Starting From</legend>
                <input type="date" className="input"/>
              </div>
              <div>
                <legend className="fieldset-legend">to</legend>
                <input type="date" className="input"/>
              </div>
            </fieldset>
            <legend className="fieldset-legend">Frequency</legend>
                <select defaultValue="Server location" className="select select-neutral">
                  <option disabled={true}>Frequency</option>
                  <option>Hour</option>
                  <option>Minute</option>
                  <option>Second</option>
                </select>
            
            {/* -----------------Advance Settings------------------ */}
            <h3 className='text-3xl font-bold'>Advance Settings</h3>
            <fieldset className="fieldset flex flex-row">
              <div>
              <legend className="fieldset-legend">Module Database</legend>
                <select defaultValue="Server location" className="select select-neutral">
                  <option disabled={true}>Panel Type</option>
                  <option>North America</option>
                  <option>EU west</option>
                  <option>South East Asia</option>
                </select>
                
                <legend className="fieldset-legend">Inverter Database</legend>
                <select defaultValue="Server location" className="select select-neutral">
                  <option disabled={true}>Panel Type</option>
                  <option>North America</option>
                  <option>EU west</option>
                  <option>South East Asia</option>
                </select>
              </div>
              
              <div>
              <legend className="fieldset-legend">Module Dataset</legend>
                <select defaultValue="Server location" className="select select-neutral">
                  <option disabled={true}>Panel Type</option>
                  <option>North America</option>
                  <option>EU west</option>
                  <option>South East Asia</option>
                </select>
                
                <legend className="fieldset-legend">Inverter Dataset</legend>
                <select defaultValue="Server location" className="select select-neutral">
                  <option disabled={true}>Panel Type</option>
                  <option>North America</option>
                  <option>EU west</option>
                  <option>South East Asia</option>
                </select>
              </div>
            </fieldset>

            <div>
              <legend className="fieldset-legend">Module Tempetarure</legend>
                <select defaultValue="Server location" className="select select-neutral">
                  <option disabled={true}>Panel Type</option>
                  <option>North America</option>
                  <option>EU west</option>
                  <option>South East Asia</option>
                </select>
                
                <legend className="fieldset-legend">Temperature Dataset</legend>
                <select defaultValue="Server location" className="select select-neutral">
                  <option disabled={true}>Panel Type</option>
                  <option>North America</option>
                  <option>EU west</option>
                  <option>South East Asia</option>
                </select>
              </div>

            <button className="btn btn-success text-white">Download Report</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default IVModeling
