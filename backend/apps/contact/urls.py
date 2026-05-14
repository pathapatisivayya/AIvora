from django.urls import path

from . import views

urlpatterns = [
    path("inquiries/", views.InquiryCreateView.as_view(), name="inquiry-create"),
    path("admin/inquiries/", views.InquiryListView.as_view(), name="admin-inquiry-list"),
    path("admin/inquiries/<int:pk>/", views.InquiryDetailView.as_view(), name="admin-inquiry-detail"),
    path("settings/", views.SiteSettingsView.as_view(), name="site-settings"),
]
