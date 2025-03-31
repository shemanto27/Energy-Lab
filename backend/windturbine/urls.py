from django.urls import path
from .views import wind_power_simulation_api

urlpatterns = [
    path("wind-turbine/", wind_power_simulation_api, name="wind-simulation"),
]
