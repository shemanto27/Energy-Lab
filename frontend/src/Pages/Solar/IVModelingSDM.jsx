import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Label } from 'recharts';

function IVModelingSDM() {
  const API_URL = 'http://localhost:8000/api/i-v-curve-sdm/';

  const [effectiveIrradiance, setEffectiveIrradiance] = useState(1000);
  const [tempCell, setTempCell] = useState(55);
  const [alphaSc, setAlphaSc] = useState(0.004539);
  const [aRef, setARef] = useState(2.6373);
  const [ILRef, setILRef] = useState(5.114);
  const [IoRef, setIoRef] = useState(8.196e-10);
  const [RshRef, setRshRef] = useState(381.68);
  const [Rs, setRs] = useState(1.065);
  const [EgRef, setEgRef] = useState(1.121);
  const [dEgdT, setDEgdT] = useState(-0.0002677);
  const [irradRef, setIrradRef] = useState(1000);
  const [tempRef, setTempRef] = useState(25);
  const [model, setModel] = useState('lambertw');

  const [ivCurveData, setIvCurveData] = useState([]);
  const [keypoints, setKeypoints] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      effective_irradiance: parseFloat(effectiveIrradiance),
      temp_cell: parseFloat(tempCell),
      alpha_sc: parseFloat(alphaSc),
      a_ref: parseFloat(aRef),
      I_L_ref: parseFloat(ILRef),
      I_o_ref: parseFloat(IoRef),
      R_sh_ref: parseFloat(RshRef),
      R_s: parseFloat(Rs),
      EgRef: parseFloat(EgRef),
      dEgdT: parseFloat(dEgdT),
      irrad_ref: parseFloat(irradRef),
      temp_ref: parseFloat(tempRef),
      model: model,
    };

    try {
      const response = await axios.post(API_URL, requestData);
      setIvCurveData(response.data.i_v_curve_data.iv_curve);
      setKeypoints(response.data.i_v_curve_data.keypoints);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='flex flex-row justify-between'>
      {/* Left Side Section */}
      <section>
        <div className='card w-96 bg-base-100 shadow-sm'>
          <div className='card-body'>
            <h3 className='text-3xl font-bold'>I-V Curve Parameters (Part 1)</h3>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend'>Effective Irradiance</legend>
              <input
                type='text'
                className='input'
                value={effectiveIrradiance}
                onChange={(e) => setEffectiveIrradiance(e.target.value)}
              />

              <legend className='fieldset-legend'>Cell Temperature</legend>
              <input
                type='text'
                className='input'
                value={tempCell}
                onChange={(e) => setTempCell(e.target.value)}
              />

              <legend className='fieldset-legend'>Alpha SC</legend>
              <input
                type='text'
                className='input'
                value={alphaSc}
                onChange={(e) => setAlphaSc(e.target.value)}
              />

              <legend className='fieldset-legend'>A Ref</legend>
              <input
                type='text'
                className='input'
                value={aRef}
                onChange={(e) => setARef(e.target.value)}
              />

              <legend className='fieldset-legend'>I_L Ref</legend>
              <input
                type='text'
                className='input'
                value={ILRef}
                onChange={(e) => setILRef(e.target.value)}
              />
            </fieldset>
          </div>
        </div>
      </section>

      {/* Middle Section */}
      <section className='flex-grow mx-4'>
        <div className='card bg-base-100 shadow-sm'>
          <div className='card-body'>
            <h3 className='text-3xl font-bold'>I-V Curve</h3>
            <ResponsiveContainer width="80%" height={300}>
              <LineChart data={ivCurveData} margin={{ top: 20, right: 50, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="voltage" 
                  label={{ value: 'Voltage (V)', position: 'insideBottomRight', offset: -5 }} 
                  type="number" 
                  domain={[0, keypoints ? keypoints.v_oc + 5 : 40]} 
                />
                <YAxis 
                  label={{ value: 'Current (A)', angle: -90, position: 'insideLeft' }} 
                  type="number" 
                  domain={[0, keypoints ? keypoints.i_sc + 2 : 10]} 
                />
                <Tooltip />

                {/* Dashed I-V Curve Line */}
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#FF7300" 
                  strokeDasharray="5 5" 
                  dot={{ stroke: '#FF7300', strokeWidth: 2 }} 
                />

                {/* Reference Lines for Important Points */}
                {keypoints && (
                  <>
                    {/* Short Circuit Current (Isc) */}
                    <ReferenceLine 
                      x={0} 
                      y={keypoints.i_sc} 
                      label={{ value: `Isc = ${keypoints.i_sc.toFixed(2)} A`, position: 'top', offset: 20 }} 
                      stroke="blue" 
                      strokeDasharray="3 3" 
                    />

                    {/* Open Circuit Voltage (Voc) */}
                    <ReferenceLine 
                      x={keypoints.v_oc} 
                      y={0} 
                      label={{ value: `Voc = ${keypoints.v_oc.toFixed(2)} V`, position: 'bottom', offset: -70 }} 
                      stroke="red" 
                      strokeDasharray="3 3" 
                    />

                    {/* Maximum Power Current (Imp) */}
                    <ReferenceLine 
                      x={keypoints.v_mp} 
                      y={keypoints.i_mp} 
                      label={{ value: `Imp = ${keypoints.i_mp.toFixed(2)} A`, position: 'top', offset: -20 }} 
                      stroke="green" 
                      strokeDasharray="3 3" 
                    />

                    {/* Maximum Power Voltage (Vmp) */}
                    <ReferenceLine 
                      x={keypoints.v_mp} 
                      label={{ value: `Vmp = ${keypoints.v_mp.toFixed(2)} V`, position: 'top', offset: 5 }} 
                      stroke="purple" 
                      strokeDasharray="3 3" 
                    />

                    {/* Peak Power (Pmp) */}
                    <ReferenceLine 
                      x={keypoints.v_mp} 
                      y={keypoints.i_mp} 
                      label={{ value: `Pmp = ${keypoints.p_mp.toFixed(2)} W`, position: 'right', offset: 10 }} 
                      stroke="orange" 
                      strokeDasharray="3 3" 
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {keypoints && (
          <div className='flex flex-row justify-center gap-2 my-4'>
            <div className='card bg-base-100 shadow-sm'>
              <div className='card-body'>
                <h3 className='text-lg'>Key Points</h3>
                <p>
                  <strong>Isc:</strong> {keypoints.i_sc.toFixed(2)} A
                </p>
                <p>
                  <strong>Voc:</strong> {keypoints.v_oc.toFixed(2)} V
                </p>
                <p>
                  <strong>Imp:</strong> {keypoints.i_mp.toFixed(2)} A
                </p>
                <p>
                  <strong>Vmp:</strong> {keypoints.v_mp.toFixed(2)} V
                </p>
                <p>
                  <strong>Pmp:</strong> {keypoints.p_mp.toFixed(2)} W
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Right Side Section */}
      <section>
        <div className='card w-96 bg-base-100 shadow-sm'>
          <div className='card-body'>
            <h3 className='text-3xl font-bold'>I-V Curve Parameters (Part 2)</h3>
            <fieldset className='fieldset'>
              <legend className='fieldset-legend'>I_o Ref</legend>
              <input
                type='text'
                className='input'
                value={IoRef}
                onChange={(e) => setIoRef(e.target.value)}
              />

              <legend className='fieldset-legend'>R_sh Ref</legend>
              <input
                type='text'
                className='input'
                value={RshRef}
                onChange={(e) => setRshRef(e.target.value)}
              />

              <legend className='fieldset-legend'>R_s</legend>
              <input
                type='text'
                className='input'
                value={Rs}
                onChange={(e) => setRs(e.target.value)}
              />

              <legend className='fieldset-legend'>EgRef</legend>
              <input
                type='text'
                className='input'
                value={EgRef}
                onChange={(e) => setEgRef(e.target.value)}
              />

              <legend className='fieldset-legend'>dEgdT</legend>
              <input
                type='text'
                className='input'
                value={dEgdT}
                onChange={(e) => setDEgdT(e.target.value)}
              />

              <legend className='fieldset-legend'>Model</legend>
              <select
                value={model}
                className='select select-neutral'
                onChange={(e) => setModel(e.target.value)}
              >
                <option value='lambertw'>Lambert W</option>
                <option value='other_model'>Other Model</option>
              </select>

              <button className='btn btn-success text-white mt-4' onClick={handleSubmit}>
                Run Simulation
              </button>
            </fieldset>
          </div>
        </div>
      </section>
    </div>
  );
}

export default IVModelingSDM;
