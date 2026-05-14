from django.urls import path

from . import views

urlpatterns = [
    path("jobs/", views.JobListView.as_view(), name="job-list"),
    path("jobs/<slug:slug>/", views.JobDetailView.as_view(), name="job-detail"),
    path("apply/", views.JobApplicationCreateView.as_view(), name="job-apply"),
    path("admin/jobs/", views.JobAdminListCreateView.as_view(), name="admin-job-list"),
    path("admin/jobs/<int:pk>/", views.JobAdminDetailView.as_view(), name="admin-job-detail"),
    path("admin/applications/", views.ApplicationAdminListView.as_view(), name="admin-applications"),
]
