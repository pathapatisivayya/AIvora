from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    role = models.CharField(
        max_length=32,
        choices=[("staff", "Staff"), ("admin", "Admin"), ("viewer", "Viewer")],
        default="staff",
    )

    def __str__(self):
        return self.email or self.username
