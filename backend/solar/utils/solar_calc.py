import pvlib
from pvlib.location import Location
from pvlib.pvsystem import PVSystem
from pvlib.modelchain import ModelChain
from pvlib.temperature import TEMPERATURE_MODEL_PARAMETERS
import pandas as pd

# Power Output Calculation
def get_power_output(latitude,
                  longitude,
                  altitude,
                  time_zone,
                  module_db,
                  inverter_db,
                  temp_model,  
                  temp_type,   
                  module_dataset,
                  inverter_dataset,
                  tilt_angle,
                  azimuth_angle,
                  starting_time,
                  ending_time,
                  time_frequency,
                  num_of_panel_per_string,
                  num_of_string):
    """
    Simulates the Power output of a PV system for cirtain time period.

    Parameters:
    - latitude: Latitude of the location
    - longitude: Longitude of the location
    - altitude: Altitude of the location
    - time_zone: Time zone of the location
    - module_db: Module database name
    - inverter_db: Inverter database name
    - temp_model: Temperature model type
    - temp_type: Temperature model subtype
    - module_dataset: Module dataset name
    - inverter_dataset: Inverter dataset name
    - tilt_angle: Tilt angle of the PV panels
    - azimuth_angle: Azimuth angle of the PV panels
    - starting_time: Simulation start time
    - ending_time: Simulation end time
    - time_frequency: Frequency of the time series
    - num_of_panel_per_string: Number of panels per string
    - num_of_string: Number of strings per inverter

    Returns:
    - result: Simulation results
    """

    # Create a Location object
    location = Location(
        latitude=latitude,
        longitude=longitude,
        altitude=altitude,
        tz=time_zone,
    )

    # Retrieve module and inverter databases
    module_database = pvlib.pvsystem.retrieve_sam(module_db)
    inverter_database = pvlib.pvsystem.retrieve_sam(inverter_db)

    # Get temperature model parameters
    temperature_model_parameters = TEMPERATURE_MODEL_PARAMETERS[temp_model][temp_type]

    # Select module and inverter from the databases
    module = module_database[module_dataset]
    inverter = inverter_database[inverter_dataset]

    # Create PV system
    system = PVSystem(
        surface_tilt=tilt_angle,
        surface_azimuth=azimuth_angle,
        module_parameters=module,
        inverter_parameters=inverter,
        temperature_model_parameters=temperature_model_parameters,
        modules_per_string=num_of_panel_per_string,
        strings_per_inverter=num_of_string
    )

    # Create model chain
    modelchain = ModelChain(system, location)

    # Generate time range for the simulation
    time = pd.date_range(
        start=starting_time,
        end=ending_time,
        freq=time_frequency,
        tz=location.tz
    )

    # Get clear sky data for the location and time range
    clear_sky = location.get_clearsky(time)

    # Run the model with the clear sky data
    modelchain.run_model(clear_sky)

    # Get the results of the simulation
    result = modelchain.results

    return result

# I-V Curve Calculation
# Single Diode Model Input Parameters Calculation using De Soto Model
def get_sde_params( effective_irradiance,
                    temp_cell,
                    alpha_sc,
                    a_ref,
                    I_L_ref,
                    I_o_ref,
                    R_sh_ref,
                    R_s,
                    EgRef=1.121,
                    dEgdT=-0.0002677,
                    irrad_ref=1000,
                    temp_ref=25):
    """
    Get Prams for Single Diode Equation:
    # Geff -effective_irradiance
    # Tcell - temp_cell
    # EgRef (float) – The energy bandgap at reference temperature in units of eV. 1.121 eV for crystalline silicon. EgRef must be >0. For parameters from the SAM CEC module database, EgRef=1.121 is implicit for all cell types in the parameter estimation algorithm used by NREL.
    # dEgdT (float) – The temperature dependence of the energy bandgap at reference conditions in units of 1/K. May be either a scalar value (e.g. -0.0002677 as in [1]) or a DataFrame (this may be useful if dEgdT is a modeled as a function of temperature). For parameters from the SAM CEC module database, dEgdT=-0.0002677 is implicit for all cell types in the parameter estimation algorithm used by NREL.
    # irrad_ref (float, default 1000) – Reference irradiance in W/m^2.
    # temp_ref (float, default 25) – Reference cell temperature in C.


    Returns:
    Tuple of following results:
    IL, I0, Rs, Rsh, nNsVth

    """

    IL, I0, Rs, Rsh, nNsVth = pvsystem.calcparams_desoto(effective_irradiance = effective_irradiance,
                                                    temp_cell = temp_cell,
                                                    alpha_sc = alpha_sc,
                                                    a_ref = a_ref,
                                                    I_L_ref = I_L_ref,
                                                    I_o_ref = I_o_ref,
                                                    R_sh_ref = R_sh_ref,
                                                    R_s = R_s,
                                                    EgRef = EgRef,
                                                    dEgdT = dEgdT,
                                                    irrad_ref = irrad_ref,
                                                    temp_ref = temp_ref)

    result = {
        'IL': IL,
        'I0': I0,
        'Rs': Rs,
        'Rsh': Rsh,
        'nNsVth': nNsVth
    }

    return result                                               


# Single Diode Model Output Calculation
def get_sde_output( IL, I0, Rs, Rsh, nNsVth, method):

    """
    Get the output of the Single Diode Equation
    input params:
    IL - photocurrent (numeric) – Light-generated current in amperes
    I0 - saturation_current (numeric) – Diode saturation current in amperes
    Rs - series_resistance (numeric) – Series resistance in ohms
    Rsh - shunt_resistance (numeric) – Shunt resistance in ohms
    nNsVth - diode_factor (numeric) – Product of thermal voltage, diode ideality factor, and number of series-connected cells (n*Ns*Vth) in volts
    method (str) – Method to use 'lambertw', 'newton', or 'brentq'
    -----------
    Returns:
    dict or pandas.DataFrame of following results:
    
    i_sc - short circuit current in amperes.
    v_oc - open circuit voltage in volts.
    i_mp - current at maximum power point in amperes.
    v_mp - voltage at maximum power point in volts.
    p_mp - power at maximum power point in watts.
    i_x - current, in amperes, at v = 0.5*v_oc.
    i_xx - current, in amperes, at v = 0.5*(v_oc+v_mp)

    """
    result = pvsystem.singlediode(photocurrent = IL,
                                  saturation_current = I0,
                                  resistance_series = Rs,
                                  resistance_shunt = Rsh,
                                  nNsVth = nNsVth,
                                  method = method)

    return result


# I-V Curve Calculation using Single Diode Model
def get_iv_curve_sdm(effective_irradiance,
                    temp_cell,
                    alpha_sc,
                    a_ref,
                    I_L_ref,
                    I_o_ref,
                    R_sh_ref,
                    R_s,
                    EgRef=1.121,
                    dEgdT=-0.0002677,
                    irrad_ref=1000,
                    temp_ref=25,
                    method='lambertw'):
    """
    sdm stands for "Single Diode Model
    It takes detailed module parameters and calculates the I-V curve using the De Soto model.
    -----------
    input params:
    effective_irradiance (numeric) – Effective irradiance in W/m^2.
    temp_cell (numeric) – Cell temperature in C.
    alpha_sc (numeric) – The short-circuit current temperature coefficient of the module in units of A/C.
    a_ref (numeric) – The product of the number of cells in series (Ns), the cell area (A), and the efficiency of light capture of the module (Eff) in units of m^2.
    I_L_ref (numeric) – Light-generated current (or photocurrent) in amperes under reference conditions. This parameter is related to the rated power of the module, and is used to determine the reference current in the module’s I-V curve. In amperes.
    I_o_ref (numeric) – Diode saturation current in amperes under reference conditions. This can be derived from the reference module efficiency using calcparams_desoto. In amperes.
    R_sh_ref (numeric) – Shunt resistance under reference conditions in ohms. This can be derived from the reference module efficiency using calcparams_desoto. In ohms.
    R_s (numeric) – Series resistance in ohms.
    EgRef (float) – The energy bandgap at reference temperature in units of eV. 1.121 eV for crystalline silicon. EgRef must be >0. For parameters from the SAM CEC module database, EgRef=1.121 is implicit for all cell types in the parameter estimation algorithm used by NREL.
    dEgdT (float) – The temperature dependence of the energy bandgap at reference conditions in units of 1/K. May be either a scalar value (e.g. -0.0002677 as in [1]) or a DataFrame (this may be useful if dEgdT is a modeled as a function of temperature). For parameters from the SAM CEC module database, dEgdT=-0.0002677 is implicit for all cell types in the parameter estimation algorithm used by NREL.
    irrad_ref (float, default 1000) – Reference irradiance in W/m^2.
    temp_ref (float, default 25) – Reference cell temperature in C.
    method (str) – Method to use 'lambertw', 'newton', or 'brentq'
    -----------
    Returns:
        dict: {
            'iv_curve': List[{'voltage': V, 'current': I}], 
            'keypoints': {'i_sc', 'v_oc', 'i_mp', 'v_mp', 'p_mp'}
        }

    """
    # Get the parameters for the Single Diode Equation
    sde_params = get_sde_params(effective_irradiance = effective_irradiance,
                                temp_cell = temp_cell,
                                alpha_sc = alpha_sc,
                                a_ref = a_ref,
                                I_L_ref = I_L_ref,
                                I_o_ref = I_o_ref,
                                R_sh_ref = R_sh_ref,
                                R_s = R_s,
                                EgRef = EgRef,
                                dEgdT = dEgdT,
                                irrad_ref = irrad_ref,
                                temp_ref = temp_ref)

    # Get the output of the Single Diode Equation
    sde_output = get_sde_output(IL = sde_params['IL'],
                                I0 = sde_params['I0'],
                                Rs = sde_params['Rs'],
                                Rsh = sde_params['Rsh'],
                                nNsVth = sde_params['nNsVth'],
                                method = method)

    # calculate range of voltages from 0 V to V_oc (open circuit voltage)
    # Changed how curve_info is calculated, using sde_params keys that match singlediode's expected arguments
    curve_info = pvsystem.singlediode(
        photocurrent=sde_params['IL'],
        saturation_current=sde_params['I0'],
        resistance_series=sde_params['Rs'],
        resistance_shunt=sde_params['Rsh'],
        nNsVth=sde_params['nNsVth'],
        method='lambertw'
    )  
    v = pd.DataFrame(np.linspace(0., curve_info['v_oc'], 100))

    # calculate the current at each voltage
    # Pass necessary parameters directly instead of unpacking sde_output
    i = pd.DataFrame(pvsystem.i_from_v(
        resistance_shunt=sde_params['Rsh'], 
        resistance_series=sde_params['Rs'], 
        nNsVth=sde_params['nNsVth'], 
        voltage=v[0],  # Pass the first column of the DataFrame
        saturation_current=sde_params['I0'], 
        photocurrent=sde_params['IL'],
        method='lambertw'
    ))

    # Combine the voltage and current into a DataFrame
    iv_curve = pd.DataFrame({'voltage': v[0], 'current': i[0]})

    # Extract key points from the Single Diode Equation output
    keypoints = {
        'i_sc': sde_output['i_sc'],
        'v_oc': sde_output['v_oc'],
        'i_mp': sde_output['i_mp'],
        'v_mp': sde_output['v_mp'],
        'p_mp': sde_output['p_mp']
    }

    # Combine the IV curve and key points into a single result
    result = {
        'iv_curve': iv_curve.to_dict(orient='records'),
        'keypoints': keypoints
    }

    return result
                            


# I-V Curve Calculation using Key Performance Points (Isc, Voc, Imp, and Vmp.)
def get_iv_curve_keypoints(Isc, Voc, Imp, Vmp, num_points=100):
    
    """
    Generates an estimated I-V curve using key performance points.
    
    Parameters:
        Isc (float): Short-circuit current (A)
        Voc (float): Open-circuit voltage (V)
        Imp (float): Maximum power point current (A)
        Vmp (float): Maximum power point voltage (V)
        num_points (int): Number of points to generate for the curve
        
    Returns:
        dict: {
            'iv_curve': List[{'voltage': V, 'current': I}], 
            'keypoints': {'i_sc', 'v_oc', 'i_mp', 'v_mp', 'p_mp'}
        }
    """
    # Create a voltage array from 0 to Voc
    v = pd.DataFrame(np.linspace(0., Voc, num_points))

    # Estimate current using piecewise linear approximation
    i = pd.DataFrame(np.piecewise(
        v[0],
        [v[0] < Vmp, v[0] >= Vmp],
        [lambda V: Isc - (Isc - Imp) * (V / Vmp),  # Linear drop from Isc to Imp
         lambda V: Imp * (1 - (V - Vmp) / (Voc - Vmp))]  # Linear drop from Imp to 0
    ))

    # Combine voltage and current into a DataFrame
    iv_curve = pd.DataFrame({'voltage': v[0], 'current': i[0]})

    # Extract key performance points
    keypoints = {
        'i_sc': Isc,
        'v_oc': Voc,
        'i_mp': Imp,
        'v_mp': Vmp,
        'p_mp': Imp * Vmp  # Power at maximum power point
    }

    # Combine IV curve and key points into a single result
    result = {
        'iv_curve': iv_curve.to_dict(orient='records'),
        'keypoints': keypoints
    }

    return result
