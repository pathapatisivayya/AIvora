from django.contrib import admin

from .models import Service, Solution


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "order", "is_featured")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "summary")


@admin.register(Solution)
class SolutionAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "order")
    prepopulated_fields = {"slug": ("title",)}
