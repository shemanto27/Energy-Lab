from django.urls import path
from .views import solar_simulation_api, i_v_curve_sdm_api

urlpatterns = [
    path("solar/", solar_simulation_api, name="solar-simulation"),
    path("i-v-curve-sdm/", i_v_curve_sdm_api, name="i-v-curve-sdm"),
]
