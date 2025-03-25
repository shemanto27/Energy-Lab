import { useState, useEffect } from "react";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

  const [rawData, setRawData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    if (rawData.length > 0) {
      // Group data by month and sum the values
      const monthlyTotals = {};
      
      rawData.forEach(point => {
        // Extract just the YYYY-MM part from the timestamp
        const month = point.timestamp.substring(0, 7);
        
        if (!monthlyTotals[month]) {
          monthlyTotals[month] = 0;
        }
        
        // Add the value to the monthly total
        monthlyTotals[month] += point.value;
      });

      // Convert to array format for Recharts
      const monthlyChartData = Object.keys(monthlyTotals).map(month => ({
        month: month,
        totalPower: monthlyTotals[month]
      }));
      
      // Sort by month
      monthlyChartData.sort((a, b) => a.month.localeCompare(b.month));
      
      setMonthlyData(monthlyChartData);
    }
  }, [rawData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

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

    try {
      const response = await axios.post(API_URL, formDataObject, { headers });
      setRawData(response.data.ac_output); 
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
                <input type="text" className="input" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                
                <legend className="fieldset-legend">Altitude</legend>
                <input type="text" className="input" placeholder="Altitude" value={altitude} onChange={(e) => setAltitude(e.target.value)} />
                
                <legend className="fieldset-legend">Timezone</legend>
                <select value={timeZone} className="select select-neutral" onChange={(e) => setTimeZone(e.target.value)}>
                  <option disabled={true}>Timezone</option>
                  <option value="US/Mountain">US/Mountain</option>
                  <option value="US/Pacific">US/Pacific</option>
                  <option value="US/Central">US/Central</option>
                </select>
              </div>
              
              <div>
                <legend className="fieldset-legend">Longitude</legend>
                <input type="text" className="input" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
              </div>
            </fieldset>
            
            {/* -----------------System Parameters------------------ */}
            <h3 className='text-3xl font-bold'>System Parameters</h3>
            <fieldset className="fieldset flex flex-row">
              <div>
                <legend className="fieldset-legend">Number of Panels Per String</legend>
                <input type="text" className="input" placeholder="Number of Panels" value={numOfPanelPerString} onChange={(e) => setNumOfPanelPerString(e.target.value)} />
                
                
              </div>
              
              <div>
                <legend className="fieldset-legend">Number of String</legend>
                <input type="text" className="input" placeholder="Number of String" value={numOfString} onChange={(e) => setNumOfString(e.target.value)} />
                
              </div>
            </fieldset>

            <h3>Tilt Angle</h3>
            <input type="range" min={0} max="90" value={tiltAngle} className="range text-blue-300 [--range-bg:gray] [--range-thumb:blue] [--range-fill:0]" onChange={(e) => setTiltAngle(e.target.value)} />

            <h3>Azimuth Angle</h3>
            <input type="range" min={0} max="360" value={azimuthAngle} className="range text-blue-300 [--range-bg:gray] [--range-thumb:blue] [--range-fill:0]" onChange={(e) => setAzimuthAngle(e.target.value)} />

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
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalPower" fill="#8884d8" />
              </BarChart>
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
                <input type="date" className="input" value={startingTime} onChange={(e) => setStartingTime(e.target.value)} />
              </div>
              <div>
                <legend className="fieldset-legend">to</legend>
                <input type="date" className="input" value={endingTime} onChange={(e) => setEndingTime(e.target.value)} />
              </div>
            </fieldset>
            <legend className="fieldset-legend">Frequency</legend>
            <select value={timeFrequency} className="select select-neutral" onChange={(e) => setTimeFrequency(e.target.value)}>
              <option disabled={true}>Frequency</option>
              <option value="h">Hour</option>
              <option value="m">Minute</option>
              <option value="s">Second</option>
            </select>
            
            {/* -----------------Advance Settings------------------ */}
            <h3 className='text-3xl font-bold'>Advance Settings</h3>
            <fieldset className="fieldset flex flex-row">
              <div>
                <legend className="fieldset-legend">Module Database</legend>
                <select value={moduleDb} className="select select-neutral" onChange={(e) => setModuleDb(e.target.value)}>
                  <option disabled={true}>Panel Type</option>
                  <option value="SandiaMod">SandiaMod</option>
                  <option value="CECMod">CECMod</option>
                </select>
                
                <legend className="fieldset-legend">Inverter Database</legend>
                <select value={inverterDb} className="select select-neutral" onChange={(e) => setInverterDb(e.target.value)}>
                  <option disabled={true}>Panel Type</option>
                  <option value="CECInverter">CECInverter</option>
                  <option value="OtherInverter">OtherInverter</option>
                </select>
              </div>
              
              <div>
                <legend className="fieldset-legend">Module Dataset</legend>
                <select value={moduleDataset} className="select select-neutral" onChange={(e) => setModuleDataset(e.target.value)}>
                  <option disabled={true}>Panel Type</option>
                  <option value="Canadian_Solar_CS5P_220M___2009_">Canadian_Solar_CS5P_220M___2009_</option>
                  <option value="OtherModule">OtherModule</option>
                </select>
                
                <legend className="fieldset-legend">Inverter Dataset</legend>
                <select value={inverterDataset} className="select select-neutral" onChange={(e) => setInverterDataset(e.target.value)}>
                  <option disabled={true}>Panel Type</option>
                  <option value="ABB__MICRO_0_25_I_OUTD_US_208__208V_">ABB__MICRO_0_25_I_OUTD_US_208__208V_</option>
                  <option value="OtherInverter">OtherInverter</option>
                </select>
              </div>
            </fieldset>

            <div>
              <legend className="fieldset-legend">Module Temperature</legend>
              <select value={tempModel} className="select select-neutral" onChange={(e) => setTempModel(e.target.value)}>
                <option disabled={true}>Panel Type</option>
                <option value="sapm">sapm</option>
                <option value="otherTempModel">otherTempModel</option>
              </select>
              
              <legend className="fieldset-legend">Temperature Dataset</legend>
              <select value={tempType} className="select select-neutral" onChange={(e) => setTempType(e.target.value)}>
                <option disabled={true}>Panel Type</option>
                <option value="open_rack_glass_glass">open_rack_glass_glass</option>
                <option value="otherTempType">otherTempType</option>
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
