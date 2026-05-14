from django.db import models


class PageEvent(models.Model):
    path = models.CharField(max_length=500)
    referrer = models.CharField(max_length=500, blank=True)
    user_agent = models.CharField(max_length=400, blank=True)
    session_key = models.CharField(max_length=80, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["path", "created_at"]),
        ]

    def __str__(self):
        return f"{self.path} @ {self.created_at}"


class DashboardSummary(models.Model):
    """Optional daily rollup for fast dashboard reads (populated by Celery)."""

    date = models.DateField(unique=True)
    page_views = models.PositiveIntegerField(default=0)
    inquiries = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-date"]
