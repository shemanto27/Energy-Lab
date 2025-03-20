import pvlib
from pvlib.location import Location
from pvlib.pvsystem import PVSystem
from pvlib.modelchain import ModelChain
from pvlib.temperature import TEMPERATURE_MODEL_PARAMETERS
import pandas as pd

def pv_simulation(latitude,
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
    Simulates the performance of a PV system.

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
