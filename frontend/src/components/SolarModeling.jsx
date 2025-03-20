import { useState } from "react";
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function SolarModeling() {
  const API_URL = "http://localhost:8000/api/solar/";

  const [latitude, setLatitude] = useState(32.2217);
  const [longitude, setLongitude] = useState(-110.9265);
  const [altitude, setAltitude] = useState(728);
  const [timeZone, setTimeZone] = useState("US/Mountain");
  const [moduleDb, setModuleDb] = useState("SandiaMod");
  const [inverterDb, setInverterDb] = useState("CECInverter");
  const [tempModel, setTempModel] = useState("sapm");
  const [tempType, setTempType] = useState("open_rack_glass_glass");
  const [moduleDataset, setModuleDataset] = useState("Canadian_Solar_CS5P_220M___2009_");
  const [inverterDataset, setInverterDataset] = useState("ABB__MICRO_0_25_I_OUTD_US_208__208V_");
  const [tiltAngle, setTiltAngle] = useState(30);
  const [azimuthAngle, setAzimuthAngle] = useState(180);
  const [startingTime, setStartingTime] = useState("2023-01-01");
  const [endingTime, setEndingTime] = useState("2024-01-01");
  const [timeFrequency, setTimeFrequency] = useState("h");
  const [numOfPanelPerString, setNumOfPanelPerString] = useState(2);
  const [numOfString, setNumOfString] = useState(2);


  const formDataObject = {
    latitude: latitude,
    longitude: longitude,
    altitude: altitude,
    time_zone: timeZone,
    module_db: moduleDb,
    inverter_db: inverterDb,
    temp_model: tempModel,
    temp_type: tempType,
    module_dataset: moduleDataset,
    inverter_dataset: inverterDataset,
    tilt_angle: tiltAngle,
    azimuth_angle: azimuthAngle,
    starting_time: startingTime,
    ending_time: endingTime,
    time_frequency: timeFrequency,
    num_of_panel_per_string: numOfPanelPerString,
    num_of_string: numOfString
  };


  const [chartData, setChartData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    try {
      const response = await axios.post(API_URL, formDataObject, { headers });
      setChartData(response.data.ac_output); 
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  }

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
                <input type="text" className="input" placeholder="Latitude" value={setLatitude}/>
                
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

            <button className="btn btn-success text-white" onClick={handleSubmit}>Run Simulation</button>
          </div>
        </div>
      </section>

      {/* Middle Section */}
      <section className="flex-grow mx-4">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            {/* Add content for the middle section here */}
            <h3 className='text-3xl font-bold'>Monthly Power Output</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Right Side Section */}
      <section>
        <div className="card w-96 bg-base-100 shadow-sm">
          <div className="card-body">
            {/* -----------------Simulation Conditions------------------ */}
            <h3 className='text-3xl font-bold'>Simulation Conditions</h3>
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
              <legend className="fieldset-legend">Module Temperature</legend>
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

export default SolarModeling;
