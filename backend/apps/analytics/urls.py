from django.urls import path

from . import views

urlpatterns = [
    path("track/", views.TrackPageEventView.as_view(), name="analytics-track"),
    path("dashboard/", views.AnalyticsDashboardView.as_view(), name="analytics-dashboard"),
]
