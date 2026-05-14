from django.db import models
from django.utils.text import slugify


class Project(models.Model):
    CATEGORY_CHOICES = [
        ("school", "School ERP"),
        ("hospital", "Hospital"),
        ("ai", "AI Platform"),
        ("church", "Church"),
        ("government", "Government"),
        ("saas", "SaaS"),
        ("mobile", "Mobile"),
        ("other", "Other"),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=220)
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES, default="other")
    summary = models.CharField(max_length=400)
    description = models.TextField(blank=True)
    stack = models.JSONField(default=list, blank=True)
    image_url = models.URLField(blank=True)
    client_name = models.CharField(max_length=200, blank=True)
    featured = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    completed_at = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-completed_at", "title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:200]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
