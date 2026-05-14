from django.urls import path

from . import views

urlpatterns = [
    path("clients/", views.ClientListView.as_view(), name="client-list"),
    path("testimonials/", views.TestimonialListView.as_view(), name="testimonial-list"),
]
