import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

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

  const IVCurveVisualization = ({ ivData, keypoints }) => {
    const combinedData = ivData?.map(point => ({
      ...point,
      power: (point.voltage * point.current).toFixed(2)
    })) || [];

    return (
      <div className="w-full bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Solar Panel I-V and P-V Curves</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="voltage" type="number" domain={[0, 'dataMax']}>
              <Label value="Voltage (V)" offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis yAxisId="left" type="number" domain={[0, 'dataMax']}>
              <Label value="Current (A)" angle={-90} position="insideLeft" />
            </YAxis>
            <YAxis yAxisId="right" orientation="right" type="number" domain={[0, 'dataMax']}>
              <Label value="Power (W)" angle={90} position="insideRight" />
            </YAxis>
            <Tooltip formatter={(value, name) => [parseFloat(value).toFixed(2), name]} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="current" name="Current (A)" stroke="#0047AB" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            <Line yAxisId="right" type="monotone" dataKey="power" name="Power (W)" stroke="#FF7300" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            {keypoints && (
              <>
                <ReferenceLine yAxisId="left" x={0} y={keypoints.i_sc} stroke="#0047AB" strokeDasharray="3 3">
                  <Label value={`Isc = ${keypoints.i_sc.toFixed(2)} A`} position="insideTopRight" fill="#0047AB" fontWeight="bold" />
                </ReferenceLine>
                <ReferenceLine yAxisId="left" x={keypoints.v_oc} y={0} stroke="#0047AB" strokeDasharray="3 3">
                  <Label value={`Voc = ${keypoints.v_oc.toFixed(2)} V`} position="insideBottomLeft" fill="#0047AB" fontWeight="bold" />
                </ReferenceLine>
                <ReferenceLine yAxisId="left" x={keypoints.v_mp} stroke="#006400" strokeDasharray="3 3">
                  <Label value={`Vmp = ${keypoints.v_mp.toFixed(2)} V`} position="insideBottom" fill="#006400" fontWeight="bold" />
                </ReferenceLine>
                <ReferenceLine yAxisId="left" y={keypoints.i_mp} stroke="#006400" strokeDasharray="3 3">
                  <Label value={`Imp = ${keypoints.i_mp.toFixed(2)} A`} position="insideLeft" fill="#006400" fontWeight="bold" />
                </ReferenceLine>
                <ReferenceLine yAxisId="right" x={keypoints.v_mp} y={keypoints.p_mp} stroke="#FF7300" strokeDasharray="3 3">
                  <Label value={`Pmax = ${keypoints.p_mp.toFixed(2)} W`} position="right" fill="#FF7300" fontWeight="bold" />
                </ReferenceLine>
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
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
        <IVCurveVisualization ivData={ivCurveData} keypoints={keypoints} />
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
