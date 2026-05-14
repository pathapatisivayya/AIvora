from rest_framework import serializers

from .models import Service, Solution


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = (
            "id",
            "title",
            "slug",
            "summary",
            "description",
            "icon",
            "order",
            "is_featured",
            "created_at",
            "updated_at",
        )


class SolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solution
        fields = ("id", "title", "slug", "tagline", "body", "highlights", "order", "created_at")
