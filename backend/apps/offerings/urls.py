from django.urls import path

from . import views

urlpatterns = [
    path("services/", views.ServiceListView.as_view(), name="service-list"),
    path("services/<slug:slug>/", views.ServiceDetailView.as_view(), name="service-detail"),
    path("solutions/", views.SolutionListView.as_view(), name="solution-list"),
    path("solutions/<slug:slug>/", views.SolutionDetailView.as_view(), name="solution-detail"),
    path("admin/services/", views.ServiceAdminListCreateView.as_view(), name="admin-service-list"),
    path("admin/services/<int:pk>/", views.ServiceAdminDetailView.as_view(), name="admin-service-detail"),
]
