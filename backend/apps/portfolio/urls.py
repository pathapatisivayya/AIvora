from django.urls import path

from . import views

urlpatterns = [
    path("projects/", views.ProjectListView.as_view(), name="project-list"),
    path("projects/<slug:slug>/", views.ProjectDetailView.as_view(), name="project-detail"),
    path("admin/projects/", views.ProjectAdminListCreateView.as_view(), name="admin-project-list"),
    path("admin/projects/<int:pk>/", views.ProjectAdminDetailView.as_view(), name="admin-project-detail"),
]
