from django.db import models
from django.utils.text import slugify


class JobPosting(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=220)
    department = models.CharField(max_length=120, blank=True)
    location = models.CharField(max_length=120, blank=True)
    employment_type = models.CharField(
        max_length=40,
        choices=[
            ("full_time", "Full-time"),
            ("part_time", "Part-time"),
            ("contract", "Contract"),
            ("intern", "Internship"),
        ],
        default="full_time",
    )
    description = models.TextField()
    requirements = models.TextField(blank=True)
    is_open = models.BooleanField(default=True)
    posted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-posted_at", "title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:200]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class JobApplication(models.Model):
    job = models.ForeignKey(JobPosting, related_name="applications", on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    linkedin_url = models.URLField(blank=True)
    cover_letter = models.TextField(blank=True)
    resume_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} → {self.job.title}"
