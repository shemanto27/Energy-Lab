import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function WindTurbine() {
  const API_URL = "http://localhost:8000/api/wind-turbine/";

  const [googleSheetUrl, setGoogleSheetUrl] = useState("https://docs.google.com/spreadsheets/d/1hM5ZmE0znC3v0NwTIVsft6uMfqA72v6MGX-eUjc3XlE/edit?usp=sharing");
  const [timeZone, setTimeZone] = useState("Europe/Berlin");
  const [windSpeedModel, setWindSpeedModel] = useState("logarithmic");
  const [temperatureModel, setTemperatureModel] = useState("linear_gradient");
  const [densityModel, setDensityModel] = useState("ideal_gas");
  const [powerOutputModel, setPowerOutputModel] = useState("power_coefficient_curve");
  const [densityCorrection, setDensityCorrection] = useState(true);
  const [obstacleHeight, setObstacleHeight] = useState(0);
  const [hellmanExp, setHellmanExp] = useState(null);
  const [turbineType, setTurbineType] = useState("E-126/4200");
  const [hubHeight, setHubHeight] = useState(135);

  const [powerOutput, setPowerOutput] = useState([]);
  const [powerCurve, setPowerCurve] = useState([]);
  const [powerCoefficientCurve, setPowerCoefficientCurve] = useState([]);
  const [turbineInfo, setTurbineInfo] = useState(null); // New state for turbine info

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      google_sheet_url: googleSheetUrl,
      time_zone: timeZone,
      wind_speed_model: windSpeedModel,
      temperature_model: temperatureModel,
      density_model: densityModel,
      power_output_model: powerOutputModel,
      density_correction: densityCorrection,
      obstacle_height: parseFloat(obstacleHeight),
      hellman_exp: hellmanExp ? parseFloat(hellmanExp) : null,
      turbine_type: turbineType,
      hub_height: parseFloat(hubHeight),
    };

    try {
      const response = await axios.post(API_URL, requestData);
      console.log("Response:", response.data);

      // Transform power_output data for plotting
      const powerOutputData = response.data.power_output.timestamps.map((timestamp, index) => ({
        time: timestamp,
        value: response.data.power_output.values[index],
      }));

      setPowerOutput(powerOutputData);

      // Transform power_curve and power_coefficient_curve if available
      if (response.data.turbine_info?.power_curve) {
        const powerCurveData = response.data.turbine_info.power_curve.wind_speed.map((speed, index) => ({
          wind_speed: speed,
          value: response.data.turbine_info.power_curve.value[index],
        }));
        setPowerCurve(powerCurveData);
      } else {
        setPowerCurve([]);
      }

      if (response.data.turbine_info?.power_coefficient_curve) {
        const powerCoefficientCurveData = response.data.turbine_info.power_coefficient_curve.wind_speed.map((speed, index) => ({
          wind_speed: speed,
          value: response.data.turbine_info.power_coefficient_curve.value[index],
        }));
        setPowerCoefficientCurve(powerCoefficientCurveData);
      } else {
        setPowerCoefficientCurve([]);
      }

      // Set turbine info
      setTurbineInfo(response.data.turbine_info);

    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="flex flex-row justify-between">
      {/* Left Section: Input Fields (Part 1) */}
      <section>
        <div className="card w-96 bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="text-3xl font-bold">Wind Turbine Parameters (Part 1)</h3>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Google Sheet URL</legend>
              <input type="text" className="input" placeholder="Google Sheet URL" value={googleSheetUrl} onChange={(e) => setGoogleSheetUrl(e.target.value)} />

              <legend className="fieldset-legend">Time Zone</legend>
              <select value={timeZone} className="select select-neutral" onChange={(e) => setTimeZone(e.target.value)}>
                <option value="Europe/Berlin">Europe/Berlin</option>
                <option value="US/Mountain">US/Mountain</option>
                <option value="Asia/Dhaka">Asia/Dhaka</option>
              </select>

              <legend className="fieldset-legend">Wind Speed Model</legend>
              <select value={windSpeedModel} className="select select-neutral" onChange={(e) => setWindSpeedModel(e.target.value)}>
                <option value="logarithmic">Logarithmic</option>
                <option value="exponential">Exponential</option>
              </select>

              <legend className="fieldset-legend">Temperature Model</legend>
              <select value={temperatureModel} className="select select-neutral" onChange={(e) => setTemperatureModel(e.target.value)}>
                <option value="linear_gradient">Linear Gradient</option>
                <option value="constant">Constant</option>
              </select>
            </fieldset>
          </div>
        </div>
      </section>

      {/* Middle Section: Graphs */}
      <section className="flex-grow mx-4">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="text-3xl font-bold">Power Output Graph</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={powerOutput}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-row justify-center gap-2 my-4">
          {/* Power Curve */}
          <div className="card bg-base-100 shadow-sm flex-1">
            <div className="card-body">
              <h3 className="text-lg">Power Curve</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={powerCurve}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="wind_speed" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Power Coefficient Curve */}
          <div className="card bg-base-100 shadow-sm flex-1">
            <div className="card-body">
              <h3 className="text-lg">Power Coefficient Curve</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={powerCoefficientCurve}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="wind_speed" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#ffc658" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Right Section: Input Fields (Part 2) */}
      <section>
        <div className="card w-96 bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="text-3xl font-bold">Wind Turbine Parameters (Part 2)</h3>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Density Model</legend>
              <select value={densityModel} className="select select-neutral" onChange={(e) => setDensityModel(e.target.value)}>
                <option value="ideal_gas">Ideal Gas</option>
                <option value="constant">Constant</option>
              </select>

              <legend className="fieldset-legend">Power Output Model</legend>
              <select value={powerOutputModel} className="select select-neutral" onChange={(e) => setPowerOutputModel(e.target.value)}>
                <option value="power_coefficient_curve">Power Coefficient Curve</option>
                <option value="constant_efficiency">Constant Efficiency</option>
              </select>

              <legend className="fieldset-legend">Density Correction</legend>
              <input type="checkbox" checked={densityCorrection} onChange={(e) => setDensityCorrection(e.target.checked)} />

              <legend className="fieldset-legend">Obstacle Height</legend>
              <input type="number" className="input" placeholder="Obstacle Height" value={obstacleHeight} onChange={(e) => setObstacleHeight(e.target.value)} />

              <legend className="fieldset-legend">Hellman Exponent</legend>
              <input type="number" className="input" placeholder="Hellman Exponent" value={hellmanExp || ''} onChange={(e) => setHellmanExp(e.target.value)} />

              <legend className="fieldset-legend">Turbine Type</legend>
              <input type="text" className="input" placeholder="Turbine Type" value={turbineType} onChange={(e) => setTurbineType(e.target.value)} />

              <legend className="fieldset-legend">Hub Height</legend>
              <input type="number" className="input" placeholder="Hub Height" value={hubHeight} onChange={(e) => setHubHeight(e.target.value)} />
            </fieldset>

            <button className="btn btn-success text-white" onClick={handleSubmit}>Run Simulation</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WindTurbine;
