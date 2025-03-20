from django.urls import path
from .views import solar_simulation_api

urlpatterns = [
    path("solar/", solar_simulation_api, name="solar-simulation"),
]
