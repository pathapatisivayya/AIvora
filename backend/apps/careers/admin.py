from django.contrib import admin

from .models import JobApplication, JobPosting


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ("title", "department", "location", "employment_type", "is_open", "posted_at")
    list_filter = ("is_open", "employment_type")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "description")


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "job", "created_at")
    search_fields = ("full_name", "email")
    list_filter = ("job",)
