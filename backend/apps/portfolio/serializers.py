from rest_framework import serializers

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "slug",
            "category",
            "summary",
            "description",
            "stack",
            "image_url",
            "client_name",
            "featured",
            "order",
            "completed_at",
            "created_at",
        )
