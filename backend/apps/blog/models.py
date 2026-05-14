from django.conf import settings
from django.db import models
from django.utils.text import slugify


class BlogPost(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    title = models.CharField(max_length=220)
    slug = models.SlugField(unique=True, max_length=240)
    excerpt = models.CharField(max_length=400, blank=True)
    body = models.TextField()
    cover_image = models.URLField(blank=True)
    published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:230]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
