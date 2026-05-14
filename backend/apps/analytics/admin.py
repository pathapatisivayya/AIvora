from django.contrib import admin

from .models import DashboardSummary, PageEvent


@admin.register(PageEvent)
class PageEventAdmin(admin.ModelAdmin):
    list_display = ("path", "created_at")
    list_filter = ("created_at",)


@admin.register(DashboardSummary)
class DashboardSummaryAdmin(admin.ModelAdmin):
    list_display = ("date", "page_views", "inquiries")
