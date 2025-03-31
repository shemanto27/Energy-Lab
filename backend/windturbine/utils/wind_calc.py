from windpowerlib import ModelChain, WindTurbine, create_power_curve
from windpowerlib import data as wt

import numpy as np
import pandas as pd

def read_wind_data(file_path, time_zone):
    """
    Reads wind data from a CSV file, set timezone and returns it as a DataFrame.
    """
    df = pd.read_csv(file_path, index_col=0,
        header=[0, 1])
    df.index = pd.to_datetime(df.index, utc=True)
    df.index = df.index.tz_convert(
        time_zone)  # Convert to the specified timezone

    return df


def prebuild_turbine_types():
    """
    Prebuilds turbine types for the wind power calculation.
    """
    df = wt.get_turbine_types(turbine_library='oedb', print_out=False)
    return df


def create_turbine(turbine_type, hub_height):
    """
    Creates a WindTurbine object with the specified turbine type and hub height.
    """
    turbine = {
        'turbine_type': turbine_type,
        'hub_height': hub_height
    }

    wind_turbine = WindTurbine(**turbine)


    return wind_turbine


# ------------------------------Power output Function
def get_power_output(file_path, 
                    time_zone,
                    wind_speed_model,
                    temperature_model,
                    density_model,
                    power_output_model,
                    density_correction,
                    obstacle_height,
                    hellman_exp,
                    turbine_type,
                    hub_height):
    """
    Calculates the power output of the wind turbine based on the wind data.
    """
    # Read wind data
    weather_df = read_wind_data(file_path, time_zone)

    # create turbine
    power_plant = create_turbine(turbine_type = turbine_type, 
                                hub_height = hub_height)

    turbine_model = ModelChain(
        power_plant=power_plant,
        wind_speed_model=wind_speed_model,
        temperature_model=temperature_model,
        density_model=density_model,
        power_output_model=power_output_model,
        density_correction=density_correction,
        obstacle_height=obstacle_height,
        hellman_exp=hellman_exp
    ).run_model(weather_df=weather_df)

    power_output = turbine_model.power_output

    data = {
        'power_output': power_output,
        'power_plant': power_plant,
    }

    return data