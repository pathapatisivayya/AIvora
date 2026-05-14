from django.contrib import admin

from .models import Client, Testimonial


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("name", "order", "is_active")


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("client_name", "company", "rating", "order", "is_featured")
